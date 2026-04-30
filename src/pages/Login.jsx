import LoginForm from "../containers/Login/LoginForm";
import LoginLayout from "../containers/Login/LoginLayout";

export default function Login() {
  return (
    <div className="p-2">
      <LoginLayout>
        <LoginForm />
      </LoginLayout>
    </div>
  );
}