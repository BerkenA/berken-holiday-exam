import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function HandleDiscard() {
  const navigate = useNavigate();
  return () => {
    toast.info("Changes discarded");
    navigate("/profile");
  };
}

export default HandleDiscard;
