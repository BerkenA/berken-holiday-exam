import { create } from "zustand";
import { persist } from "zustand/middleware";

const AuthToken = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: (user, token) => set({user, token}),
            logout: () => set ({user: null, token: null}),
        }),
        {
            name: "auth-storage"
        }
    )
);

export default AuthToken;