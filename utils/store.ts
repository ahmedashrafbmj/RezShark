import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type user = {
	id: string;
	isAdmin: boolean;
	email: string;
	first_name: string;
	last_name: string;
	nickname: string;
	birthday: string;
	city: string;
	state: string;
};

interface UserState {
	user: user | null;
	save: (u: user | null) => void;
	isHydrates: boolean;
	setHasHydrated: (b: boolean) => void;
}

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			save: (u) => set((state) => ({ user: u })),
			isHydrates: false,
			setHasHydrated: (u) => set((state) => ({ isHydrates: u })),
		}),
		{
			name: "user",
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);

interface SideBarState {
	isOpen: boolean;
	setIsOpen: () => void;
}

const sideBarStore = create<SideBarState>()((set) => ({
	isOpen: false,
	setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export { useUserStore, sideBarStore };
