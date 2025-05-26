import LoginForm from "../../components/LoginForm";
import { Helmet } from "react-helmet-async";

function LoginCustomer() {
  return (
    <>
      <Helmet>
        <title>Login | Holidaze</title>
        <meta
          name="description"
          content="Discover and book unique holiday venues with Holidaze. Login to book an amazing holiday. Rent out your venue and earn some cash"
        />
        <meta
          name="keywords"
          content="holidaze, holiday booking, vacation rentals, travel, unique venues, accommodation, hotels, booking platform, login, login customer, login venue manager"
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
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Login
          </h1>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default LoginCustomer;
