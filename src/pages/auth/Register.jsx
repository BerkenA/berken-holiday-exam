import RegisterForm from "../../components/RegisterForm";

function RegisterCustomer() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-8 shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterCustomer;
