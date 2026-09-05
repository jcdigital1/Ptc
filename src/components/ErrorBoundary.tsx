import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Vendi Patrocínio:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.removeItem('vendi_user_session');
    } catch (e) {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-orange-50/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl border border-orange-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Algo inesperado aconteceu
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Ocorreu uma instabilidade momentânea. Clique abaixo para recarregar o Vendi Patrocínio com segurança.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recarregar página</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Ir para a página inicial</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
