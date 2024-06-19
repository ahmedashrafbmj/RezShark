"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/store";
import { toast } from "react-toastify";

export default function Home() {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const setUser = useUserStore((state) => state.save);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (isLoading) return;

		try {
			if (!email || !password) {
				toast.error("Email and password required");
				return;
			}
			setIsLoading(true);
			let response = await axios.post(`${API_URL}/login`, {
				email: email,
				password: password,
			});

			setUser(response.data);

			router.replace("/list");
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.detail);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="flex bg-slate-100 min-h-screen items-center justify-center">
			<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
				<div className="md:flex md:items-center">
					<div className="md:shrink-0 w-full md:w-60 h-60 md:h-60">
						<Image
							className="h-48 w-full object-cover md:h-60 md:w-60"
							width={200}
							height={100}
							src="/image.jpg"
							alt="Shark Image"
						/>
					</div>
					<div className="md:pl-6">
						<div className="block mt-1 text-xl  leading-tight  text-black font-bold text-center">
							Welcome! Please Sign In
						</div>

						<form onSubmit={onSubmit}>
							<div>
								<div className="label mt-4">
									<span className="label-text">Email</span>
								</div>
								<label className="input input-bordered flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										fill="currentColor"
										className="w-4 h-4 opacity-70"
									>
										<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
										<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
									</svg>
									<input
										type="text"
										className="grow"
										placeholder="Email"
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</label>
							</div>

							<div>
								<div className="label mt-1">
									<span className="label-text">Password</span>
								</div>
								<label className="input input-bordered flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										fill="currentColor"
										className="w-4 h-4 opacity-70"
									>
										<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
										<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
									</svg>
									<input
										type="password"
										className="grow"
										placeholder="Password"
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
								</label>
							</div>

							<button
								className="btn btn-primary  bg-blue-500 text-white w-full mt-4 hover:bg-blue-400"
								type="submit"
							>
								{isLoading ? (
									<span className="loading loading-spinner text-white"></span>
								) : (
									"Login"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
}
