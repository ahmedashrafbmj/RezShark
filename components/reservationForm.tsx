import { API_URL } from "@/utils/constants";
import { useUserStore } from "@/utils/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "./loading";

type error = {
	resName?: string;
	email?: string;
	password?: string;
	gameDate?: string;
	earliestTime?: string;
	latestTime?: string;
	playerCount?: string;
	name?: string;
	confirmationEmail?: string;
	ccEmails?: string;
	hideInBackground?: string;
	courses?: string;
};

type selectedCourses = {
	black: boolean;
	blue: boolean;
	red: boolean;
	green: boolean;
	yellow: boolean;
};

type queryType = {
	id: string;
	resName: string;
	name: string;
	email: string;
	password: string;
	dateOpened: string;
	confirmationEmail: string;
	ccEmails: string[];
	selectCourses: number[];
	gameDate: string;
	type: string;
	status: boolean;
	userId: string;
	earliestTime: string;
	latestTime: string;
	playerCount: number;
};

export default function ReservationForm() {
	const userData = useUserStore((state) => state.user);

	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const [resData, setResData] = useState<queryType[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);

	const [resName, setResName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [gameDate, setGameDate] = useState("");
	const [earliestTime, setEarliestTime] = useState("");
	const [latestTime, setLatestTime] = useState("");
	const [playerCount, setPlayerCount] = useState("");
	const [name, setName] = useState("");
	const [confirmationEmail, setConfirmationEmail] = useState("");
	const [ccEmails, setCcEmails] = useState("");
	const [hideInBackground, setHideInBackground] = useState(true);
	const [selectedCourses, setSelectedCourses] = useState<selectedCourses>({
		black: false,
		blue: false,
		green: false,
		red: false,
		yellow: false,
	});

	const [errors, setErrors] = useState<error>({});

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setSelectedCourses({
			...selectedCourses,
			[name]: checked,
		});
	};

	const resetStates = () => {
		setResName("");
		setEmail("");
		setPassword("");
		setGameDate("");
		setEarliestTime("");
		setLatestTime("");
		setPlayerCount("");
		setName("");
		setConfirmationEmail("");
		setCcEmails("");
		setHideInBackground(true);
		setSelectedCourses({
			black: false,
			blue: false,
			green: false,
			red: false,
			yellow: false,
		});
	};

	const validateEmail = (email: string) => {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(email);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const newErrors: error = {};

		// Validate required fields
		if (!resName.trim()) newErrors.resName = "Rservation Name is required";

		if (!email.trim() && !validateEmail(email)) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(email)) {
			newErrors.email = "Invalid email format";
		}
		if (!password.trim()) newErrors.password = "Password is required";
		if (!gameDate.trim()) newErrors.gameDate = "Game date is required";
		if (!earliestTime.trim())
			newErrors.earliestTime = "Earliest time is required";
		if (!latestTime.trim())
			newErrors.latestTime = "Latest time is required";
		if (!playerCount.trim())
			newErrors.playerCount = "Player count is required";
		if (!name.trim()) newErrors.name = "Name is required";
		if (!confirmationEmail.trim() && !validateEmail(confirmationEmail)) {
			newErrors.confirmationEmail = "Confirmation email is required";
		} else if (!validateEmail(confirmationEmail)) {
			newErrors.confirmationEmail = "Invalid email format";
		}
		const atLeastOneCourseSelected =
			Object.values(selectedCourses).some(Boolean);
		if (!atLeastOneCourseSelected)
			newErrors.courses = "At least one course must be selected";

		if (!userData?.id) return;

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			setIsLoading(true);
			try {
				// If no errors, submit the form data
				// ['black', 'blue', 'green', 'red', 'yellow']
				let selectCourses = Object.values(selectedCourses).map(
					(course) => Number(course)
				);

				// console.log("Form submitted:", {
				// 	email,
				// 	password,
				// 	gameDate,
				// 	earliestTime,
				// 	latestTime,
				// 	playerCount,
				// 	name,
				// 	confirmationEmail,
				// 	ccEmails,
				// 	hideInBackground,
				// 	selectCourses,
				// });

				await axios.post(`${API_URL}/addReservation`, {
					userId: userData?.id,
					resName,
					email,
					password,
					gameDate,
					earliestTime,
					latestTime,
					playerCount,
					name,
					confirmationEmail,
					ccEmails: ccEmails.includes("\n")
						? ccEmails.split("\n").join(",").split(",")
						: ccEmails.split(",") ?? [""],
					hideInBackground,
					selectCourses,
					dateOpened: new Date().toLocaleString("en-US"),
				});

				resetStates();
				getQueriesData();
				toast.success("Reservation Added Succesfully");
			} catch (error) {
				toast.error("Reservation Failed");
			} finally {
				setIsLoading(false);
			}
		}
	};

	const getQueriesData = async () => {
		setIsLoading(true);
		try {
			let response = await axios.get(
				`${API_URL}/reservations?isAdmin=${
					userData?.isAdmin ?? false
				}&userId=${userData?.id ?? ""}&showType=false`
			);

			if (response.data?.length > 0) {
				setResData(response.data);
			}
		} catch (error) {
			console.log("ERROR", error);
			setResData([]);
		} finally {
			setIsLoading(false);
		}
	};

	const onAutoFillSelect = (data: queryType) => {
		setResName(data.resName);
		setEmail(data.email);
		setPassword(data.password);
		setGameDate(data.gameDate);
		setEarliestTime(data.earliestTime);
		setLatestTime(data.latestTime);
		setPlayerCount(data.playerCount.toString());
		setName(data.name);
		setConfirmationEmail(data.confirmationEmail);
		setCcEmails(data.ccEmails.toString());

		const coursesMapping = {
			0: "black",
			1: "blue",
			2: "green",
			3: "red",
			4: "yellow",
		};

		const newSelectedCourses: selectedCourses = {
			black: false,
			blue: false,
			green: false,
			red: false,
			yellow: false,
		};

		data.selectCourses.forEach((course, index) => {
			const courseName = coursesMapping[
				index as keyof typeof coursesMapping
			] as keyof selectedCourses;
			if (courseName) {
				newSelectedCourses[courseName] = course === 1;
			}
		});

		setSelectedCourses(newSelectedCourses);

		setShowDropdown(false);
	};

	useEffect(() => {
		getQueriesData();
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<div className="flex-col justify-start text-center items-center px-6 py-8 bg-white">
			<form className="space-y-8" onSubmit={handleSubmit}>
				<div className="bg-slate-700 p-4 text-white flex-col w-full rounded-xl">
					<div className="dropdown dropdown-bottom w-full">
						<div
							tabIndex={0}
							role="button"
							className="btn m-1 bg-blue-700 hover:bg-blue-700 text-white w-full  text-lg"
							onClick={() => setShowDropdown((p) => !p)}
						>
							Auto Fill Reservation
						</div>
						<ul
							tabIndex={0}
							hidden={!showDropdown}
							className="dropdown-content z-[1]  p-2  rounded-box w-full bg-white shadow-lg text-black text-lg max-h-52 overflow-y-scroll"
						>
							{resData?.map((data) => (
								<li
									key={data.id}
									className="py-2 hover:bg-slate-300 hover:cursor-pointer"
									onClick={() => onAutoFillSelect(data)}
								>
									{data.resName}
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="bg-slate-700 p-4 text-white flex-col w-full rounded-xl">
					<div className="label mt-1">
						<span className="label-text">Reservation Name</span>
					</div>
					<label className="input input-bordered flex items-center gap-2">
						<input
							type="text"
							className="grow"
							placeholder="Reservation Name"
							value={resName}
							onChange={(e) => setResName(e.target.value)}
						/>
					</label>
					{errors.resName && (
						<p className="text-red-500 mt-2">{errors.resName}</p>
					)}
				</div>

				<div className="md:flex justify-between mt-4 bg-slate-700 p-4 text-white dark:[color-scheme:dark] rounded-xl md:space-x-10">
					<div className="flex-col w-full">
						<div className="label mt-1">
							<span className="label-text">
								Booking Email Address
							</span>
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
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</label>
						{errors.email && (
							<p className="text-red-500 mt-2">{errors.email}</p>
						)}
					</div>
					<div className="flex-col w-full">
						<div className="label mt-1">
							<span className="label-text">
								Booking Email Password
							</span>
						</div>
						<label className="input input-bordered flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="w-4 h-4 opacity-70"
							>
								<path
									fillRule="evenodd"
									d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
									clipRule="evenodd"
								/>
							</svg>
							<input
								type="password"
								className="grow"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</label>
						{errors.password && (
							<p className="text-red-500 mt-2">
								{errors.password}
							</p>
						)}
					</div>
				</div>

				<div className="sm:flex sm:space-x-8 space-y-4 sm:space-y-0">
					<div className="flex-1 bg-slate-700 p-4 text-white dark:[color-scheme:dark] rounded-xl  space-y-4">
						<div className="flex-col w-full">
							<div className="label mt-1">
								<span className="label-text">Game Date</span>
							</div>
							<label className="input input-bordered flex items-center gap-2">
								<input
									type="date"
									className="grow"
									placeholder="Game Date"
									value={gameDate}
									onChange={(e) =>
										setGameDate(e.target.value)
									}
								/>
							</label>
							{errors.gameDate && (
								<p className="text-red-500  mt-2">
									{errors.gameDate}
								</p>
							)}
						</div>
						<div className="flex-col w-full">
							<div className="label mt-1">
								<span className="label-text">
									Earliest Time
								</span>
							</div>
							<label className="input input-bordered flex items-center gap-2">
								<input
									type="time"
									className="grow"
									placeholder="Earliest Time"
									value={earliestTime}
									onChange={(e) =>
										setEarliestTime(e.target.value)
									}
								/>
							</label>
							{errors.earliestTime && (
								<p className="text-red-500  mt-2">
									{errors.earliestTime}
								</p>
							)}
						</div>
						<div className="flex-col w-full">
							<div className="label mt-1">
								<span className="label-text">Latest Time</span>
							</div>
							<label className="input input-bordered flex items-center gap-2">
								<input
									type="time"
									className="grow"
									placeholder="Latest Time"
									value={latestTime}
									onChange={(e) =>
										setLatestTime(e.target.value)
									}
								/>
							</label>
							{errors.latestTime && (
								<p className="text-red-500  mt-2">
									{errors.latestTime}
								</p>
							)}
						</div>
						<div className="flex-col w-full">
							<div className="label mt-1">
								<span className="label-text">Player Count</span>
							</div>
							<label className="input input-bordered flex items-center gap-2">
								<input
									type="number"
									className="grow"
									placeholder="Player Count"
									min={1}
									value={playerCount}
									onChange={(e) =>
										setPlayerCount(e.target.value)
									}
								/>
							</label>
							{errors.playerCount && (
								<p className="text-red-500  mt-2">
									{errors.playerCount}
								</p>
							)}
						</div>
						<div className="flex-col w-full">
							<div className="label mt-1">
								<span className="label-text">Name</span>
							</div>
							<label className="input input-bordered flex items-center gap-2">
								<input
									type="text"
									className="grow"
									placeholder="Name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</label>
							{errors.name && (
								<p className="text-red-500  mt-2">
									{errors.name}
								</p>
							)}
						</div>
					</div>
					<div className="flex-1  bg-slate-700  rounded-xl   p-4 text-white">
						<span className="label-text text-lg font-bold">
							Select Courses to Search
						</span>
						<div className="grid grid-cols-1 lg:grid-cols-2 mt-4  gap-y-1 md:gap-y-0 gap-x-0 md:gap-x-8">
							{Object.keys(selectedCourses).map((course) => (
								<div className="form-control" key={course}>
									<label className="cursor-pointer label">
										<span className="label-text text-lg">
											{course.charAt(0).toUpperCase() +
												course.slice(1)}
										</span>
										<input
											type="checkbox"
											name={course}
											className="checkbox checkbox-success checkbox-md custom-checkbox"
											checked={
												selectedCourses[
													course as keyof selectedCourses
												]
											}
											onChange={handleCheckboxChange}
										/>
									</label>
								</div>
							))}
						</div>
						{errors.courses && (
							<p className="text-red-500  mt-2 text-center">
								{errors.courses}
							</p>
						)}
					</div>
				</div>
				<div className="flex-col space-y-6 bg-slate-700 text-white dark:[color-scheme:dark] rounded-xl  p-6">
					<div className="flex-col w-full">
						<div className="label mt-1">
							<span className="label-text">
								Booking Confirmation Email Receipent
							</span>
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
								value={confirmationEmail}
								onChange={(e) =>
									setConfirmationEmail(e.target.value)
								}
							/>
						</label>
						{errors.confirmationEmail && (
							<p className="text-red-500 mt-2">
								{errors.confirmationEmail}
							</p>
						)}
					</div>
					<div className="flex-col w-full">
						<div className="label mt-1">
							<span className="label-text">
								Booking Confirmation Email CC&apos;s
							</span>
						</div>
						<textarea
							placeholder="mail@gmail.com, mail@gmail.com"
							className="textarea textarea-bordered textarea-md w-full "
							value={ccEmails}
							onChange={(e) => setCcEmails(e.target.value)}
						></textarea>
					</div>

					{/* <div className="form-control items-center ">
						<label className="cursor-pointer label space-x-4">
							<input
								type="checkbox"
								defaultChecked={true}
								className="checkbox checkbox-success
                                checkbox-md "
								checked={hideInBackground}
								onChange={(e) =>
									setHideInBackground(e.target.checked)
								}
							/>
							<span className="label-text text-lg">
								Hide in Background
							</span>
						</label>
					</div> */}
				</div>

				<div className="flex space-x-2 justify-center">
					<button
						className="btn bg-purple-500 md:w-1/3 w-full text-lg h-16 text-white hover:bg-purple-400"
						type="submit"
					>
						Add Reservation
					</button>
					{/* <button
						className="btn bg-red-500 hover:bg-red-400 w-1/3 text-lg h-16 text-white"
						type="submit"
					>
						Stop
					</button> */}
				</div>
			</form>
		</div>
	);
}
