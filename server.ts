import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_NEIGHBORHOODS, INITIAL_USERS, INITIAL_METRICS } from './src/data/initialData';
import { Ad, User, Report, NeighborhoodItem, AccountDeletionRequest, PlatformMetrics } from './src/types';

const PORT = 3000;
const DB_DIR = path.join(process.cwd(), 'server-data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface DatabaseSchema {
  ads: Ad[];
  users: User[];
  passwords: Record<string, string>; // userId -> password
  neighborhoods: NeighborhoodItem[];
  reports: Report[];
  deletionRequests: AccountDeletionRequest[];
  metrics: PlatformMetrics;
}

// Ensure database file exists
function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure all keys exist
      return {
        ads: Array.isArray(parsed.ads) ? parsed.ads : [],
        users: Array.isArray(parsed.users) ? parsed.users : INITIAL_USERS,
        passwords: parsed.passwords || { user_admin: 'admin123' },
        neighborhoods: Array.isArray(parsed.neighborhoods) && parsed.neighborhoods.length > 0
          ? parsed.neighborhoods
          : INITIAL_NEIGHBORHOODS,
        reports: Array.isArray(parsed.reports) ? parsed.reports : [],
        deletionRequests: Array.isArray(parsed.deletionRequests) ? parsed.deletionRequests : [],
        metrics: parsed.metrics || INITIAL_METRICS
      };
    } catch (e) {
      console.error('Error reading db.json, creating clean database:', e);
    }
  }

  const defaultDb: DatabaseSchema = {
    ads: [],
    users: INITIAL_USERS,
    passwords: { user_admin: 'admin123' },
    neighborhoods: INITIAL_NEIGHBORHOODS,
    reports: [],
    deletionRequests: [],
    metrics: INITIAL_METRICS
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
  return defaultDb;
}

let db: DatabaseSchema = initDatabase();

function saveDatabase() {
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

// Strip sensitive passwords before returning to client
function sanitizeUser(u: User): User {
  const { emailVerificationCode, ...safeUser } = u;
  return safeUser as User;
}

// Server-Sent Events (SSE) subscribers
const sseClients = new Set<express.Response>();

function broadcastSSE(type: string, payload: any) {
  const message = `data: ${JSON.stringify({ type, payload, timestamp: Date.now() })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      adsCount: db.ads.length,
      usersCount: db.users.length,
      connectedClients: sseClients.size,
      time: new Date().toISOString()
    });
  });

  // Full state endpoint for client synchronization
  app.get('/api/state', (req, res) => {
    res.json({
      ads: db.ads,
      allAdsCount: db.ads.length,
      users: db.users.map(sanitizeUser),
      neighborhoods: db.neighborhoods,
      reports: db.reports,
      deletionRequests: db.deletionRequests,
      metrics: db.metrics
    });
  });

  // SSE Live Stream for instant multi-user updates
  app.get('/api/live-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);

    // Initial handshake ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`);

    // Keep connection alive every 25 seconds
    const interval = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: 'PING' })}\n\n`);
      } catch (e) {
        clearInterval(interval);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(interval);
      sseClients.delete(res);
    });
  });

  // Check username availability in real-time
  app.post('/api/auth/check-username', (req, res) => {
    const rawUsername = (req.body.username || '').trim().toLowerCase();
    const formatted = rawUsername.startsWith('@') ? rawUsername : `@${rawUsername}`;

    const RESERVED = ['@admin', '@vendipatrocinio', '@suporte', '@moderador', '@patrocinio', '@oficial'];
    if (RESERVED.includes(formatted)) {
      return res.json({ available: false, reason: 'Este nome de usuário é reservado pela plataforma.' });
    }

    const regex = /^@[a-zA-Z0-9._]{3,30}$/;
    if (!regex.test(formatted)) {
      return res.json({
        available: false,
        reason: 'Use entre 3 e 30 caracteres (letras, números, pontos e sublinhados).'
      });
    }

    const exists = db.users.some(u => u.username.toLowerCase() === formatted);
    if (exists) {
      return res.json({ available: false, reason: 'Este nome de usuário já está sendo utilizado. Escolha outro.' });
    }

    return res.json({ available: true, formatted, message: 'Este nome de usuário está disponível.' });
  });

  // Register user
  app.post('/api/auth/register', (req, res) => {
    const {
      name,
      username,
      avatarUrl,
      email,
      phone,
      neighborhood,
      password,
      birthDate,
      termsAccepted,
      privacyAccepted,
      age18Confirmed
    } = req.body;

    // Strict validation: none can be empty
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'O nome completo é obrigatório.' });
    }
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'O nome de usuário é obrigatório.' });
    }
    // Avatar URL: empty by default until user uploads their own photo
    const finalAvatarUrl = (avatarUrl && avatarUrl.trim()) ? avatarUrl.trim() : '';

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'O e-mail é obrigatório.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'O número de celular com DDD é obrigatório.' });
    }
    if (!neighborhood || !neighborhood.trim()) {
      return res.status(400).json({ error: 'Selecione seu bairro em Patrocínio.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    if (!termsAccepted || !privacyAccepted || !age18Confirmed) {
      return res.status(400).json({ error: 'É necessário aceitar os Termos de Uso, a Política de Privacidade e declarar ter 18 anos ou mais.' });
    }

    // Email format validation
    const emailClean = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      return res.status(400).json({ error: 'Informe um endereço de e-mail válido.' });
    }

    // Duplicate email check
    const existingEmail = db.users.find(u => u.email.toLowerCase() === emailClean);
    if (existingEmail) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado em outra conta.' });
    }

    // Username format and duplicate check
    let cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername.startsWith('@')) cleanUsername = `@${cleanUsername}`;
    if (!/^@[a-zA-Z0-9._]{3,30}$/.test(cleanUsername)) {
      return res.status(400).json({ error: 'Nome de usuário inválido. Deve começar com @ e conter apenas letras, números, pontos ou sublinhados.' });
    }
    const existingUsername = db.users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existingUsername) {
      return res.status(400).json({ error: 'Este nome de usuário já está sendo utilizado. Escolha outro.' });
    }

    // Phone format and duplicate check (must be 11 Brazilian digits: DDD + 9 digits)
    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length !== 11) {
      return res.status(400).json({ error: 'Número de celular inválido. Informe o DDD (2 dígitos) seguido de 9 dígitos.' });
    }
    const ddd = rawDigits.substring(0, 2);
    const dddNum = parseInt(ddd, 10);
    if (dddNum < 11 || dddNum > 99) {
      return res.status(400).json({ error: 'DDD inválido. Informe um código de área brasileiro válido.' });
    }
    if (rawDigits.charAt(2) !== '9') {
      return res.status(400).json({ error: 'O número de celular deve começar com o dígito 9 após o DDD.' });
    }

    const internationalPhone = `+55${rawDigits}`;
    const displayWhatsapp = `(${ddd}) ${rawDigits.substring(2, 7)}-${rawDigits.substring(7)}`;

    const existingPhone = db.users.find(u => u.phone === internationalPhone || u.phone === rawDigits || u.whatsapp.replace(/\D/g, '') === rawDigits);
    if (existingPhone) {
      return res.status(400).json({ error: 'Este número de WhatsApp já está cadastrado em outra conta.' });
    }

    // Age validation (18+)
    if (birthDate) {
      let birth: Date | null = null;
      const bStr = String(birthDate).trim();
      if (bStr.includes('/')) {
        const parts = bStr.split('/');
        if (parts.length === 3) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          const y = parseInt(parts[2], 10);
          if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1910 && y <= new Date().getFullYear()) {
            birth = new Date(y, m - 1, d);
          }
        }
      } else if (bStr.includes('-')) {
        const parts = bStr.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          const d = parseInt(parts[2], 10);
          if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1910 && y <= new Date().getFullYear()) {
            birth = new Date(y, m - 1, d);
          }
        }
      } else {
        const parsed = new Date(bStr);
        if (!isNaN(parsed.getTime())) {
          birth = parsed;
        }
      }

      if (!birth || isNaN(birth.getTime())) {
        return res.status(400).json({ error: 'Data de nascimento inválida. Digite no formato DD/MM/AAAA.' });
      }

      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 18) {
        return res.status(400).json({ error: 'Apenas maiores de 18 anos podem criar uma conta no Vendi Patrocínio.' });
      }
    }

    // Generate 6-digit confirmation code with 15 minutes expiration
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newUser: User = {
      id: userId,
      name: name.trim(),
      username: cleanUsername,
      email: emailClean,
      phone: internationalPhone,
      whatsapp: displayWhatsapp,
      neighborhood: neighborhood.trim(),
      avatarUrl: finalAvatarUrl,
      bio: '',
      joinedDate: 'Hoje',
      activeAdsCount: 0,
      soldAdsCount: 0,
      isBlocked: false,
      isSuspended: false,
      isWhatsAppVerified: true, // Registered mobile is verified
      isEmailVerified: true, // Email confirmed upon registration without extra codes
      emailVerificationCode: undefined,
      emailVerificationExpiresAt: undefined,
      hasAcceptedSellerDisclaimer: false,
      birthDate,
      role: 'user',
      termsAcceptance: {
        termsVersion: 'v2.1',
        privacyVersion: 'v2.1',
        acceptedAt: new Date().toISOString(),
        ipAddress: req.ip || '177.136.204.1 (Patrocínio - MG)',
        method: 'web_registration_form',
        confirmedAge18: true
      }
    };

    db.users.push(newUser);
    db.passwords[userId] = password;
    saveDatabase();

    broadcastSSE('USER_REGISTERED', { id: userId, username: cleanUsername });

    console.log(`[AUTH] User registered successfully: ${emailClean} (${cleanUsername})`);

    return res.status(201).json({
      success: true,
      requireEmailVerification: false,
      user: sanitizeUser(newUser),
      message: 'Conta criada com sucesso!'
    });
  });

  // Verify email code
  app.post('/api/auth/verify-email', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'E-mail e código são obrigatórios.' });
    }

    const emailClean = email.trim().toLowerCase();
    const user = db.users.find(u => u.email.toLowerCase() === emailClean);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.isEmailVerified) {
      return res.json({ success: true, user: sanitizeUser(user), message: 'E-mail já está confirmado!' });
    }

    if (user.emailVerificationExpiresAt) {
      const expiry = new Date(user.emailVerificationExpiresAt);
      if (Date.now() > expiry.getTime()) {
        return res.status(400).json({ error: 'O código de confirmação expirou. Clique em "Reenviar código" para gerar um novo.' });
      }
    }

    if (user.emailVerificationCode !== code.trim()) {
      return res.status(400).json({ error: 'Código de confirmação incorreto. Verifique os dígitos recebidos.' });
    }

    // Success: Mark as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpiresAt = undefined;
    saveDatabase();

    broadcastSSE('USER_VERIFIED', { id: user.id, username: user.username });

    return res.json({
      success: true,
      user: sanitizeUser(user),
      message: 'E-mail verificado com sucesso! Bem-vindo ao Vendi Patrocínio.'
    });
  });

  // Resend confirmation code
  app.post('/api/auth/resend-code', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });

    const emailClean = email.trim().toLowerCase();
    const user = db.users.find(u => u.email.toLowerCase() === emailClean);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    if (user.isEmailVerified) {
      return res.json({ success: true, message: 'Este e-mail já está verificado.' });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    user.emailVerificationCode = newCode;
    user.emailVerificationExpiresAt = expiresAt;
    saveDatabase();

    console.log(`[AUTH] Resent confirmation code for ${emailClean}: ${newCode}`);

    return res.json({
      success: true,
      demoCode: newCode,
      codeExpiresAt: expiresAt,
      message: `Novo código de verificação enviado para ${emailClean}.`
    });
  });

  // Correct email address before verification
  app.post('/api/auth/change-email', (req, res) => {
    const { oldEmail, newEmail } = req.body;
    if (!oldEmail || !newEmail) return res.status(400).json({ error: 'E-mails anterior e novo são obrigatórios.' });

    const cleanOld = oldEmail.trim().toLowerCase();
    const cleanNew = newEmail.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanNew)) {
      return res.status(400).json({ error: 'O novo endereço de e-mail é inválido.' });
    }

    const exists = db.users.find(u => u.email.toLowerCase() === cleanNew);
    if (exists && exists.email.toLowerCase() !== cleanOld) {
      return res.status(400).json({ error: 'O novo e-mail já está cadastrado em outra conta.' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === cleanOld);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    user.email = cleanNew;
    user.isEmailVerified = false;
    user.emailVerificationCode = newCode;
    user.emailVerificationExpiresAt = expiresAt;
    saveDatabase();

    console.log(`[AUTH] Email corrected to ${cleanNew}, new code: ${newCode}`);

    return res.json({
      success: true,
      newEmail: cleanNew,
      demoCode: newCode,
      codeExpiresAt: expiresAt,
      message: `E-mail alterado para ${cleanNew}. Novo código enviado.`
    });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Preencha o e-mail/usuário e a senha.' });
    }

    const clean = emailOrUsername.trim().toLowerCase();
    const cleanUser = clean.startsWith('@') ? clean : `@${clean}`;

    const user = db.users.find(u =>
      u.email.toLowerCase() === clean ||
      u.username.toLowerCase() === clean ||
      u.username.toLowerCase() === cleanUser
    );

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou e-mail não encontrado. Crie sua conta gratuitamente!' });
    }

    const storedPassword = db.passwords[user.id];
    if (storedPassword && storedPassword !== password) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    if (user.isBlocked || user.isSuspended) {
      return res.status(403).json({
        error: `Esta conta está suspensa ou bloqueada. Motivo: ${user.suspensionReason || 'Violação das regras da comunidade'}`
      });
    }

    return res.json({
      success: true,
      user: sanitizeUser(user),
      message: `Bem-vindo(a) de volta, ${user.name}!`
    });
  });

  // Get all active ads (sorted newest first)
  app.get('/api/ads', (req, res) => {
    // Only active ads are returned to general users
    const activeAds = db.ads
      .filter(a => a.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(activeAds);
  });

  // Create an ad
  app.post('/api/ads', (req, res) => {
    try {
      const {
        title,
        description,
        price,
        priceType,
        categoryId,
        condition,
        neighborhood,
        photos,
        acceptsOffers,
        isFeatured,
        userId
      } = req.body;

      if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });

      // Find seller in database by ID or email
      let seller = db.users.find(u => u.id === userId);
      if (!seller && req.body.currentUser?.email) {
        seller = db.users.find(u => u.email.toLowerCase() === String(req.body.currentUser.email).toLowerCase());
      }
      if (!seller && req.body.sellerEmail) {
        seller = db.users.find(u => u.email.toLowerCase() === String(req.body.sellerEmail).toLowerCase());
      }

      // If user session is active on client but missing from server (e.g. server was restarted or cache restored), auto-restore user
      if (!seller && (req.body.currentUser || req.body.sellerName)) {
        const uData = req.body.currentUser || {};
        const uWhatsapp = req.body.whatsapp || uData.whatsapp || '(34) 99999-0000';
        seller = {
          id: userId,
          name: (uData.name || req.body.sellerName || 'Vendedor Patrocínio').trim(),
          username: (uData.username || req.body.sellerUsername || `@user_${String(userId).substring(0, 6)}`).trim(),
          email: (uData.email || req.body.sellerEmail || `${userId}@vendipatrocinio.com.br`).trim().toLowerCase(),
          phone: uData.phone || req.body.sellerPhone || `+55${uWhatsapp.replace(/\D/g, '')}`,
          whatsapp: uWhatsapp,
          neighborhood: uData.neighborhood || neighborhood || 'Centro',
          avatarUrl: uData.avatarUrl || req.body.sellerAvatar || '',
          bio: uData.bio || '',
          joinedDate: uData.joinedDate || 'Hoje',
          activeAdsCount: 0,
          soldAdsCount: 0,
          isBlocked: false,
          isSuspended: false,
          isWhatsAppVerified: true,
          isEmailVerified: true,
          hasAcceptedSellerDisclaimer: true,
          role: (uData.role === 'admin' ? 'admin' : 'user')
        };
        db.users.push(seller);
        saveDatabase();
        console.log(`[POST /api/ads] Restored seller into db.users: ${seller.name} (${seller.id})`);
      }

      if (!seller) {
        return res.status(404).json({ error: 'Sessão do vendedor não encontrada. Entre novamente na sua conta.' });
      }

      // Automatically sync seller avatar if provided by client request
      const incomingAvatar = req.body.sellerAvatar || req.body.currentUser?.avatarUrl;
      if (incomingAvatar && (!seller.avatarUrl || seller.avatarUrl.trim() === '')) {
        seller.avatarUrl = incomingAvatar;
        saveDatabase();
      }

      if (!seller.avatarUrl || seller.avatarUrl.trim() === '') {
        return res.status(403).json({ error: 'Você precisa ter uma foto de perfil cadastrada para publicar anúncios no Vendi Patrocínio.' });
      }

      if (seller.isBlocked || seller.isSuspended) {
        return res.status(403).json({ error: 'Conta suspensa. Não é possível anunciar.' });
      }

      if (!title || !title.trim()) return res.status(400).json({ error: 'Título do anúncio é obrigatório.' });
      if (!categoryId) return res.status(400).json({ error: 'Selecione uma categoria.' });
      if (!neighborhood) return res.status(400).json({ error: 'Selecione o bairro.' });
      if (!photos || photos.length === 0) return res.status(400).json({ error: 'Adicione pelo menos uma foto.' });

      // Anti-duplicate check by same seller (null-safe and excludes self for re-sync)
      const targetId = req.body.id || ('ad_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
      const cleanTitle = title.trim().toLowerCase();
      const isDuplicate = db.ads.some(
        a => a.id !== targetId &&
        a.sellerId === seller.id &&
        a.status === 'active' &&
        (a.title || '').trim().toLowerCase() === cleanTitle
      );
      if (isDuplicate) {
        return res.status(400).json({ error: 'Você já possui um anúncio ativo com este mesmo título no Vendi Patrocínio.' });
      }

      const newAd: Ad = {
        id: targetId,
        title: title.trim(),
        description: (description || '').trim(),
        price: Number(price) || 0,
        priceType: priceType || 'fixed',
        categoryId,
        condition: condition || 'usado',
        neighborhood: neighborhood.trim(),
        city: 'Patrocínio - MG',
        whatsapp: seller.whatsapp || req.body.whatsapp || '(34) 99999-0000',
        photos,
        acceptsOffers: Boolean(acceptsOffers),
        isFeatured: Boolean(isFeatured),
        status: (req.body.status as any) || 'active',
        sellerId: seller.id,
        sellerName: seller.name,
        sellerUsername: seller.username,
        sellerAvatar: seller.avatarUrl,
        sellerJoinedDate: seller.joinedDate || req.body.sellerJoinedDate || 'Hoje',
        sellerWhatsAppVerified: seller.isWhatsAppVerified,
        createdAt: req.body.createdAt || new Date().toISOString(),
        viewsCount: Number(req.body.viewsCount) || 0,
        whatsappClicksCount: Number(req.body.whatsappClicksCount) || 0
      };

      const existingIndex = db.ads.findIndex(a => a.id === targetId);
      if (existingIndex !== -1) {
        db.ads[existingIndex] = newAd;
      } else {
        db.ads.unshift(newAd);
        seller.activeAdsCount = (seller.activeAdsCount || 0) + 1;
        db.metrics = db.metrics || { ...INITIAL_METRICS };
        db.metrics.totalAdsCreated = (db.metrics.totalAdsCreated || 0) + 1;
      }
      seller.hasAcceptedSellerDisclaimer = true;
      saveDatabase();

      // Broadcast instant real-time event to all connected browsers/devices
      broadcastSSE('AD_CREATED', newAd);

      return res.status(201).json({ success: true, ad: newAd, seller: sanitizeUser(seller) });
    } catch (err: any) {
      console.error('[POST /api/ads] Error creating ad:', err);
      return res.status(500).json({ error: 'Ocorreu um erro interno ao processar o anúncio. Tente novamente.' });
    }
  });

  // Mark ad as sold or update status
  app.put('/api/ads/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, userId } = req.body;

    const ad = db.ads.find(a => a.id === id);
    if (!ad) return res.status(404).json({ error: 'Anúncio não encontrado.' });

    // Verify ownership or admin
    const user = db.users.find(u => u.id === userId);
    if (!user || (user.id !== ad.sellerId && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Permissão negada para alterar este anúncio.' });
    }

    const previousStatus = ad.status;
    ad.status = status;

    if (status === 'sold' && previousStatus !== 'sold') {
      const seller = db.users.find(u => u.id === ad.sellerId);
      if (seller) {
        seller.activeAdsCount = Math.max(0, (seller.activeAdsCount || 1) - 1);
        seller.soldAdsCount = (seller.soldAdsCount || 0) + 1;
      }
      db.metrics.totalSold = (db.metrics.totalSold || 0) + 1;
    }

    saveDatabase();
    broadcastSSE('AD_UPDATED', ad);

    return res.json({ success: true, ad });
  });

  // Delete an ad
  app.delete('/api/ads/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    const index = db.ads.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Anúncio não encontrado.' });

    const ad = db.ads[index];
    const user = db.users.find(u => u.id === userId);
    if (!user || (user.id !== ad.sellerId && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Permissão negada para excluir este anúncio.' });
    }

    db.ads.splice(index, 1);
    const seller = db.users.find(u => u.id === ad.sellerId);
    if (seller && ad.status === 'active') {
      seller.activeAdsCount = Math.max(0, (seller.activeAdsCount || 1) - 1);
    }
    saveDatabase();

    broadcastSSE('AD_DELETED', { id });
    return res.json({ success: true, id });
  });

  // Update user profile and automatically synchronize active ads
  app.put('/api/users/profile', (req, res) => {
    try {
      const { id, name, phone, whatsapp, neighborhood, bio, avatarUrl } = req.body;
      let user = db.users.find(u => u.id === id);

      if (!user) {
        // Auto-create or restore user if missing from server db
        const uWhatsapp = whatsapp || '(34) 99999-0000';
        user = {
          id: id || 'usr_' + Date.now(),
          name: (name || 'Usuário Patrocínio').trim(),
          username: `@user_${String(id || '').substring(0, 6)}`,
          email: `${id}@vendipatrocinio.com.br`,
          phone: phone || `+55${uWhatsapp.replace(/\D/g, '')}`,
          whatsapp: uWhatsapp,
          neighborhood: neighborhood || 'Centro',
          avatarUrl: avatarUrl || '',
          bio: bio || '',
          joinedDate: 'Hoje',
          activeAdsCount: 0,
          soldAdsCount: 0,
          isBlocked: false,
          isSuspended: false,
          isWhatsAppVerified: true,
          isEmailVerified: true,
          hasAcceptedSellerDisclaimer: true,
          role: 'user'
        };
        db.users.push(user);
      }

      if (name) {
        user.name = name.trim();
        for (const ad of db.ads) {
          if (ad.sellerId === user.id) {
            ad.sellerName = user.name;
          }
        }
      }
      if (avatarUrl) {
        user.avatarUrl = avatarUrl.trim();
        for (const ad of db.ads) {
          if (ad.sellerId === user.id) {
            ad.sellerAvatar = user.avatarUrl;
          }
        }
      }
      if (neighborhood) user.neighborhood = neighborhood.trim();
      if (bio !== undefined) user.bio = bio.trim();

      // If whatsapp/phone changed, format and update all active ads by this seller!
      if (whatsapp) {
        const rawDigits = whatsapp.replace(/\D/g, '');
        if (rawDigits.length === 11) {
          const ddd = rawDigits.substring(0, 2);
          user.phone = `+55${rawDigits}`;
          user.whatsapp = `(${ddd}) ${rawDigits.substring(2, 7)}-${rawDigits.substring(7)}`;

          // Synchronize all user's ads immediately on server
          for (const ad of db.ads) {
            if (ad.sellerId === user.id) {
              ad.whatsapp = user.whatsapp;
              ad.sellerName = user.name;
              ad.sellerAvatar = user.avatarUrl;
            }
          }
        }
      }

      saveDatabase();
      broadcastSSE('USER_UPDATED', sanitizeUser(user));

      return res.json({ success: true, user: sanitizeUser(user) });
    } catch (err: any) {
      console.error('[PUT /api/users/profile] Error updating profile:', err);
      return res.status(500).json({ error: 'Erro ao atualizar perfil no servidor.' });
    }
  });

  // Neighborhoods management API
  app.get('/api/neighborhoods', (req, res) => {
    res.json(db.neighborhoods);
  });

  app.post('/api/neighborhoods', (req, res) => {
    const { name, type } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Nome do bairro é obrigatório.' });

    const newNeighborhood: NeighborhoodItem = {
      id: 'nb_' + Date.now(),
      name: name.trim(),
      type: type || 'bairro',
      active: true
    };

    db.neighborhoods.push(newNeighborhood);
    // Keep alphabetical sort
    db.neighborhoods.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    saveDatabase();

    broadcastSSE('NEIGHBORHOODS_UPDATED', db.neighborhoods);
    return res.status(201).json({ success: true, neighborhoods: db.neighborhoods });
  });

  app.put('/api/neighborhoods/:id', (req, res) => {
    const { id } = req.params;
    const { name, active, type } = req.body;

    const item = db.neighborhoods.find(n => n.id === id);
    if (!item) return res.status(404).json({ error: 'Bairro não encontrado.' });

    if (name) item.name = name.trim();
    if (active !== undefined) item.active = Boolean(active);
    if (type) item.type = type;

    db.neighborhoods.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    saveDatabase();

    broadcastSSE('NEIGHBORHOODS_UPDATED', db.neighborhoods);
    return res.json({ success: true, neighborhoods: db.neighborhoods });
  });

  // Reports
  app.post('/api/reports', (req, res) => {
    const { type, adId, adTitle, targetUserId, targetUserName, targetUsername, reporterName, reporterContact, reason, details } = req.body;

    const newReport: Report = {
      id: 'rep_' + Date.now(),
      type: type || 'ad',
      adId,
      adTitle,
      targetUserId,
      targetUserName,
      targetUsername,
      reporterName: reporterName || 'Anônimo',
      reporterContact,
      reason: reason || 'outro',
      details: details || '',
      createdAt: 'Hoje',
      status: 'pending'
    };

    db.reports.unshift(newReport);
    saveDatabase();
    return res.status(201).json({ success: true, report: newReport });
  });

  // LGPD Deletion requests
  app.post('/api/deletion-requests', (req, res) => {
    const { userId, reason } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const request: AccountDeletionRequest = {
      id: 'del_' + Date.now(),
      userId: user.id,
      userName: user.name,
      username: user.username,
      email: user.email,
      reason: reason || 'Solicitado pelo usuário',
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };

    db.deletionRequests.unshift(request);
    saveDatabase();
    return res.status(201).json({ success: true, request });
  });

  // Metrics tracking
  app.post('/api/metrics/visit', (req, res) => {
    db.metrics.totalVisits = (db.metrics.totalVisits || 0) + 1;
    saveDatabase();
    res.json({ success: true, totalVisits: db.metrics.totalVisits });
  });

  app.post('/api/metrics/whatsapp-click', (req, res) => {
    const { adId } = req.body;
    db.metrics.whatsappClicks = (db.metrics.whatsappClicks || 0) + 1;
    if (adId) {
      const ad = db.ads.find(a => a.id === adId);
      if (ad) ad.whatsappClicksCount = (ad.whatsappClicksCount || 0) + 1;
    }
    saveDatabase();
    res.json({ success: true, whatsappClicks: db.metrics.whatsappClicks });
  });

  // --- VITE MIDDLEWARE (Dev) OR STATIC (Prod) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vendi Patrocínio] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
