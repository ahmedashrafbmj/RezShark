"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/store";
import { toast } from "react-toastify";
import Header from "@/components/header";
import { withAuth } from "@/components/withAuth";
import Loading from "@/components/loading";

const Signup = () => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [nickname, setNickname] = useState("");
	const [birthday, setBirthday] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [code, setCode] = useState("");

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			if (!email || !password || !firstName || !lastName || !nickname) {
				toast.error("Email, password, and names are required");
				return;
			}

			if (code == "" || code != "EARLY") {
				toast.error("Invalid code");
				return;
			}

			setIsLoading(true);

			let response = await axios.post(`${API_URL}/signup`, {
				email: email,
				password: password,
				first_name: firstName,
				last_name: lastName,
				nickname: nickname,
				birthday: birthday,
				city: city,
				state: state,
				isAdmin: false,
			});

			toast.success("Registered Successfully");
			router.back();
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.detail);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<div className="flex-col">
			<Header title="Register" showBack />

			<main className="flex overflow-y-scroll bg-slate-100 h-full items-center justify-center">
				<div className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-[80%] p-8 md:mt-0 mt-24 w-full">
					<div className="md:flex md:items-center">
						<div className="md:shrink-0 w-full md:w-60">
							<Image
								className="h-48 w-full object-cover md:h-60 md:w-60"
								width={200}
								height={100}
								src="/image.jpg"
								alt="Shark Image"
							/>
						</div>
						<div className="md:pl-6 w-full">
							<form
								onSubmit={onSubmit}
								className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0 w-full"
							>
								{" "}
								<div className="col-span-2">
									<div className="label mt-4">
										<span className="label-text">
											Email
										</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="email"
											className="grow"
											placeholder="Email"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-2">
									<div className="label mt-4">
										<span className="label-text">
											Password
										</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="password"
											className="grow"
											placeholder="Password"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-1">
									<div className="label mt-4">
										<span className="label-text">
											First Name
										</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="text"
											className="grow"
											placeholder="First Name"
											value={firstName}
											onChange={(e) =>
												setFirstName(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-1">
									<div className="label mt-4">
										<span className="label-text">
											Last Name
										</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="text"
											className="grow"
											placeholder="Last Name"
											value={lastName}
											onChange={(e) =>
												setLastName(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-1">
									<div className="label mt-4">
										<span className="label-text">
											Nickname
										</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="text"
											className="grow"
											placeholder="Nickname"
											value={nickname}
											onChange={(e) =>
												setNickname(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-1">
									<div className="label mt-4">
										<span className="label-text">
											Birthday
										</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="date"
											className="grow"
											placeholder="Birthday"
											value={birthday}
											onChange={(e) =>
												setBirthday(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-1">
									<div className="label mt-4">
										<span className="label-text">City</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="text"
											className="grow"
											placeholder="City"
											value={city}
											onChange={(e) =>
												setCity(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-1">
									<div className="label mt-4">
										<span className="label-text">
											State
										</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="text"
											className="grow"
											placeholder="State"
											value={state}
											onChange={(e) =>
												setState(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-2">
									<div className="label mt-4">
										<span className="label-text">Code</span>
									</div>
									<label className="input input-bordered flex items-center gap-2">
										<input
											type="text"
											className="grow"
											placeholder="Code"
											value={code}
											onChange={(e) =>
												setCode(e.target.value)
											}
										/>
									</label>
								</div>
								<div className="col-span-2">
									<button
										className="btn btn-primary bg-blue-500 text-white w-full mt-4 hover:bg-blue-400"
										type="submit"
									>
										Sign Up
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Signup;
