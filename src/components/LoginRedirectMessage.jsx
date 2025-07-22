import { useSearchParams } from 'react-router-dom';

const LoginRedirectMessage = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  if (!redirect) return null;

  return (
    <div className="login-redirect-message">
      <div className="alert alert-warning" role="alert">
        <strong>Atenção!</strong> Você precisa fazer login para acessar esta página.
      </div>
    </div>
  );
};

export default LoginRedirectMessage; 