import LoginForm from "../../components/LoginForm";

function LoginCustomer() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: "url('./register-background.jpg')",
      }}
    >
      <div className="w-full max-w-lg bg-white p-8 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginCustomer;
