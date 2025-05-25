import RegisterForm from "../../components/RegisterForm";
import { Helmet } from "react-helmet";

function RegisterCustomer() {
  return (
    <>
      <Helmet>
        <title>Register | Holidaze</title>
        <meta
          name="description"
          content="Discover and book unique holiday venues with Holidaze. Register to book an amazing holiday. Rent out your venue and earn some cash"
        />
        <meta
          name="keywords"
          content="holidaze, holiday booking, vacation rentals, travel, unique venues, accommodation, hotels, booking platform, register, register customer, register venue manager"
        />
        <meta name="author" content="Berken Ates" />
      </Helmet>
      
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: "url('./register-background.jpg')",
        }}
      >
        <div className="w-full max-w-lg bg-white p-8 shadow-xl rounded-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Register
          </h1>
          <RegisterForm />
        </div>
      </div>
    </>
  );
}

export default RegisterCustomer;
