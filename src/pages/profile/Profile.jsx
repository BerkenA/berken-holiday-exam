import AuthToken from "../../components/Authtoken";
import { Link } from "react-router-dom";

function Profile() {
  const user = AuthToken((state) => state.user);

  if (!user) {
    return <p className="text-center mt-10">You are not logged in</p>;
  }
  return (
    <div className="min-h-screen flex justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full text-center">
        <button className="rounded">
          <Link to="/edit-profile">Edit profile</Link>
        </button>
        {user.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "User avatar"}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 flex items-center justify-center text-gray-600">
            No Avatar
          </div>
        )}
        <h1 className="text-2xl font-semibold text-blue-600">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
        {user.venueManager && (
          <p className="text-sm text-green-600 mt-2">Venue Manager</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
