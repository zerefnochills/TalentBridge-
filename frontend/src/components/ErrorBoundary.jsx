import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        if (typeof console !== 'undefined' && console.error) {
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-main to-dark-secondary p-8">
                    <div className="card max-w-2xl w-full">
                        <h1 className="text-2xl font-bold text-danger mb-4">Something went wrong</h1>
                        <p className="text-text-muted mb-4">
                            The application encountered an error. Please try refreshing the page.
                        </p>

                        {this.state.error && (
                            <div className="bg-danger/20 border border-danger/50 rounded-xl p-4 mb-4">
                                <p className="font-mono text-sm text-danger">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="btn btn-primary"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-outline"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
