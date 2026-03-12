import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 max-w-2xl mx-auto mt-10 bg-destructive/10 border border-destructive rounded-lg text-destructive-foreground">
                    <h1 className="text-2xl font-bold mb-4">Algo deu errado.</h1>
                    <p className="mb-4">Ocorreu um erro ao renderizar a aplicação.</p>

                    <div className="bg-black/80 text-white p-4 rounded overflow-auto text-sm font-mono mb-4">
                        {this.state.error && this.state.error.toString()}
                    </div>

                    {this.state.errorInfo && (
                        <details className="whitespace-pre-wrap font-mono text-xs opacity-70">
                            {this.state.errorInfo.componentStack}
                        </details>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                        Recarregar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
