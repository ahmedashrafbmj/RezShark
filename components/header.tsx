import { sideBarStore } from "@/utils/store";
import { useRouter } from "next/navigation";

function Header({
	title,
	showBack = false,
}: {
	title: string;
	showBack?: boolean;
}) {
	const router = useRouter();
	const setIsOpen = sideBarStore((state) => state.setIsOpen);

	return (
		<div
			className={`w-full h-24 lg:pl-10 pl-4 flex  items-center custom-container ${
				showBack ? "md:justify-start justify-between " : "justify-start"
			}}`}
		>
			<div
				className="lg:hidden block w-10"
				onClick={() => {
					setIsOpen();
				}}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
					<g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g>
					<g id="SVGRepo_iconCarrier">
						{" "}
						<path
							d="M4 18L20 18"
							stroke="#ffffff"
							stroke-width="2"
							stroke-linecap="round"
						></path>{" "}
						<path
							d="M4 12L20 12"
							stroke="#ffffff"
							stroke-width="2"
							stroke-linecap="round"
						></path>{" "}
						<path
							d="M4 6L20 6"
							stroke="#ffffff"
							stroke-width="2"
							stroke-linecap="round"
						></path>{" "}
					</g>
				</svg>
			</div>
			<span className="md:text-2xl text-lg text-white lg:pl-0 pl-4 self-center font-bold">
				{title}
			</span>
			{showBack ? (
				<button
					className="btn btn-neutral bg-white text-black md:hidden block"
					onClick={() => {
						router.back();
					}}
				>
					Go Back
				</button>
			) : null}
		</div>
	);
}

export default Header;
