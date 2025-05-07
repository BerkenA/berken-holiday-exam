import RegisterForm from "../../components/RegisterForm";

function RegisterCustomer() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterCustomer;
