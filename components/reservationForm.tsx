import { API_URL, BOOKING_CLASS_DATA } from "@/utils/constants";
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
	requestType?: string;
	scriptDate?: string;
	scriptTime?: string;
	bookingClass?: string;
};

type queryType = {
	id: string;
	resName: string;
	requestType: string;
	name: string;
	email: string;
	password: string;
	dateOpened: string;
	confirmationEmail: string;
	ccEmails: string[];
	selectCourses: number[];
	selectCoursesNames: string[];
	selectCoursesUrl: string;
	gameDate: string;
	type: string;
	status: boolean;
	userId: string;
	earliestTime: string;
	latestTime: string;
	playerCount: number;
	scriptDate: string;
	scriptTime: string;
	booking_class: string;
};

type inCoursesType = {
	course_id: number;
	course_name: string;
};

type coursesType = {
	website_path: string;
	course_title: string;
	location: string;
	courses: inCoursesType[];
	holes: string;
};

export default function ReservationForm() {
	const userData = useUserStore((state) => state.user);

	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const [coursesData, setCoursesData] = useState<coursesType[]>([]);
	const [selectCourse, setSelectCourses] = useState<coursesType | null>(null);
	const [courseIds, setCourseIds] = useState<number[]>([]);

	const [resData, setResData] = useState<queryType[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [reqDropdown, setReqDropdown] = useState(false);

	const [scriptDate, setScriptDate] = useState("");
	const [scriptTime, setScriptTime] = useState("");

	const [requestType, setRequestType] = useState("");
	const [resName, setResName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [gameDate, setGameDate] = useState("");
	const [bookingClass, setBookingClass] = useState("Resident");
	const [earliestTime, setEarliestTime] = useState("");
	const [latestTime, setLatestTime] = useState("");
	const [playerCount, setPlayerCount] = useState("");
	const [name, setName] = useState("");
	const [confirmationEmail, setConfirmationEmail] = useState("");
	const [ccEmails, setCcEmails] = useState("");
	const [hideInBackground, setHideInBackground] = useState(true);

	const [errors, setErrors] = useState<error>({});

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		if (courseIds.includes(Number(value))) {
			let crsIds = courseIds.filter((c) => c != Number(value));

			setCourseIds(crsIds);
		} else {
			let crsIds = [...courseIds, Number(value)];
			setCourseIds(crsIds);
		}
	};

	const resetStates = () => {
		setScriptDate("");
		setScriptTime("");
		setRequestType("");
		setResName("");
		setEmail("");
		setPassword("");
		setGameDate("");
		setBookingClass("");
		setEarliestTime("");
		setLatestTime("");
		setPlayerCount("");
		setName("");
		setConfirmationEmail("");
		setCcEmails("");
		setHideInBackground(true);
		setSelectCourses(null);
		setCourseIds([]);
	};

	const validateEmail = (email: string) => {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(email);
	};

	const convertToUTC = () => {
		const [hours, minutes] = scriptTime.split(":");
		const date = new Date();
		date.setHours(Number(hours));
		date.setMinutes(Number(minutes));
		date.setSeconds(0);
		date.setMilliseconds(0);

		const utcHours = date.getUTCHours().toString().padStart(2, "0");
		const utcMinutes = date.getUTCMinutes().toString().padStart(2, "0");

		let finalTime = `${utcHours}:${utcMinutes}`;

		return finalTime;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const newErrors: error = {};

		// Validate required fields
		if (!resName.trim()) newErrors.resName = "Reservation Name is required";

		if (!email.trim() && !validateEmail(email)) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(email)) {
			newErrors.email = "Invalid email format";
		}

		if (requestType == "Time") {
			if (!scriptDate.trim())
				newErrors.scriptDate = "Tool date is required";
			if (!scriptTime.trim())
				newErrors.scriptTime = "Tool time is required";
		}

		if (!requestType.trim())
			newErrors.requestType = "Request Type is required";
		if (!password.trim()) newErrors.password = "Password is required";
		if (!gameDate.trim()) newErrors.gameDate = "Game date is required";
		if (!bookingClass?.trim())
			newErrors.bookingClass = "Booking Type is required";
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
		const atLeastOneCourseSelected = courseIds.length > 0;
		if (!atLeastOneCourseSelected)
			newErrors.courses = "At least one course must be selected";

		if (!userData?.id) return;

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			setIsLoading(true);
			try {
				// If no errors, submit the form data

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
					booking_class: bookingClass,
					confirmationEmail,
					ccEmails: ccEmails.includes("\n")
						? ccEmails.split("\n").join(",").split(",")
						: ccEmails.split(",") ?? [""],
					hideInBackground,
					selectCourses: selectCourse?.courses
						.map((c) => {
							if (courseIds.includes(c.course_id)) {
								return c.course_id;
							}

							return null;
						})
						.filter(Boolean),
					selectCoursesNames: selectCourse?.courses
						.map((c) => {
							if (courseIds.includes(c.course_id)) {
								return c.course_name.trim();
							}

							return null;
						})
						.filter(Boolean),
					selectCoursesUrl: selectCourse?.website_path,
					dateOpened: new Date().toLocaleString("en-US"),
					requestType,
					scriptDate,
					scriptTime: convertToUTC(),
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
		}
	};

	const getCoursesData = async () => {
		try {
			let response = await axios.get(`${API_URL}/getCourses`);

			if (response.data?.length > 0) {
				setCoursesData(response.data);
			}
		} catch (error) {
			console.log("ERROR", error);
			setCoursesData([]);
		} finally {
			setIsLoading(false);
		}
	};

	const onAutoFillSelect = (data: queryType) => {
		setRequestType(data.requestType);
		setResName(data.resName);
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
		setBookingClass(data.booking_class);

		let courses: coursesType = {} as coursesType;
		coursesData?.forEach((c) => {
			let idx = c.courses.findIndex(
				(cc) => cc.course_id === data.selectCourses[0]
			);

			if (idx != -1) {
				courses = c;
				return;
			}
		});
		setSelectCourses(courses);
		setCourseIds(data.selectCourses);

		setShowDropdown(false);
	};

	useEffect(() => {
		getQueriesData();
		getCoursesData();
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<div>
			<form
				onSubmit={handleSubmit}
				className="flex-col justify-start text-center items-center px-4 py-8 bg-white"
			>
				<h2 className="text-xl font-bold text-start mb-2">
					Pre-Load Reservation
				</h2>
				<div className="bg-gray-700 p-4 text-white flex-col w-full rounded-xl">
					<div>
						<div className="dropdown dropdown-bottom w-full">
							<div
								tabIndex={0}
								role="button"
								className="btn m-1 bg-blue-500 hover:bg-blue-600 text-white w-full  text-lg"
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
				</div>

				<div className="h-8" />
				<h2 className="text-xl font-bold text-start mb-2">
					Reservation Creation
				</h2>
				<div className="grid md:grid-cols-2 grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4 px-6 pb-4 pt-2 bg-gray-700  rounded-xl">
					<div className=" text-white flex-col w-full rounded-xl">
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
							<p className="text-red-500 mt-2">
								{errors.resName}
							</p>
						)}
					</div>

					<div className=" text-white flex-col rounded-xl">
						<div className="label mt-1">
							<span className="label-text">
								Reservation Request Type
							</span>
						</div>
						<div className="dropdown dropdown-bottom w-full">
							<div
								tabIndex={0}
								role="button"
								className="btn  bg-blue-500 hover:bg-blue-600 text-white w-full md:text-lg text-base"
								onClick={() => setReqDropdown((p) => !p)}
							>
								{requestType != ""
									? `${requestType} Request`
									: "Choose Request Type"}
							</div>
							<ul
								tabIndex={0}
								hidden={!reqDropdown}
								className="dropdown-content z-[1]  p-2  rounded-box w-full bg-white shadow-lg text-black text-lg max-h-52 overflow-y-scroll"
							>
								{["Standard", "Time"]?.map((data, i) => (
									<li
										key={i}
										className="py-2 hover:bg-slate-300 hover:cursor-pointer"
										onClick={() => {
											setRequestType(data);
											setReqDropdown(false);
										}}
									>
										{data} Request
									</li>
								))}
							</ul>
						</div>

						{errors.requestType && (
							<p className="text-red-500 mt-2">
								{errors.requestType}
							</p>
						)}
					</div>
				</div>

				{requestType == "Time" && (
					<>
						<div className="h-8" />
						<h2 className="text-xl font-bold text-start mb-2">
							Tool Configuration
						</h2>
						<div className="grid md:grid-cols-2 grid-cols-1 space-x-4 md:space-y-0 space-y-4 px-6 pb-4 pt-2 bg-gray-700 items-end rounded-xl text-white dark:[color-scheme:dark]">
							<div className="flex-col w-full">
								<div className="label mt-1">
									<span className="label-text">
										Tool Run Date
									</span>
								</div>
								<label className="input input-bordered flex items-center gap-2">
									<input
										type="date"
										className="grow"
										placeholder="Tool Date"
										value={scriptDate}
										onChange={(e) => {
											setScriptDate(e.target.value);
											setGameDate("");
										}}
									/>
								</label>
								{errors.scriptDate && (
									<p className="text-red-500 mt-2">
										{errors.scriptDate}
									</p>
								)}
							</div>
							<div className="flex-col w-full">
								<div className="label mt-1">
									<span className="label-text">
										Tool Run Time
									</span>
								</div>
								<label className="input input-bordered flex items-center gap-2">
									<input
										type="time"
										className="grow"
										placeholder="Tool Time"
										value={scriptTime}
										onChange={(e) =>
											setScriptTime(e.target.value)
										}
									/>
								</label>
								{errors.scriptTime && (
									<p className="text-red-500 mt-2">
										{errors.scriptTime}
									</p>
								)}
							</div>
						</div>
					</>
				)}

				<div className="h-8" />
				<h2 className="text-xl font-bold text-start mb-2">
					Reservation Account Details
				</h2>
				<div className="grid md:grid-cols-2 grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4 px-6 pb-4 pt-2 bg-gray-700 text-white items-end rounded-xl">
					<div className="flex-col ">
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
					<div className="flex-col ">
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

				<div className="h-8" />
				<h2 className="text-xl font-bold text-start mb-2">
					Game Details
				</h2>
				<div
					className="grid md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4 px-6 pb-4 pt-2 bg-gray-700 text-white items-end rounded-xl
				dark:[color-scheme:dark]"
				>
					<div className="flex-col ">
						<div className="label">
							<span className="label-text">Game Date</span>
						</div>
						<label className="input input-bordered flex items-center gap-2">
							<input
								type="date"
								className="grow"
								placeholder="Game Date"
								min={scriptDate}
								value={gameDate}
								onChange={(e) => setGameDate(e.target.value)}
							/>
						</label>
						{errors.gameDate && (
							<p className="text-red-500  mt-2">
								{errors.gameDate}
							</p>
						)}
					</div>
					<div className="flex-col ">
						<div className="label ">
							<span className="label-text">Earliest Time</span>
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
					<div className="flex-col ">
						<div className="label ">
							<span className="label-text">Latest Time</span>
						</div>
						<label className="input input-bordered flex items-center gap-2">
							<input
								type="time"
								className="grow"
								placeholder="Latest Time"
								value={latestTime}
								onChange={(e) => setLatestTime(e.target.value)}
							/>
						</label>
						{errors.latestTime && (
							<p className="text-red-500  mt-2">
								{errors.latestTime}
							</p>
						)}
					</div>
					<div className="flex-col ">
						<div className="label ">
							<span className="label-text">Player Count</span>
						</div>
						<label className="input input-bordered flex items-center gap-2">
							<input
								type="number"
								className="grow"
								placeholder="Player Count"
								min={1}
								value={playerCount}
								onChange={(e) => setPlayerCount(e.target.value)}
							/>
						</label>
						{errors.playerCount && (
							<p className="text-red-500  mt-2">
								{errors.playerCount}
							</p>
						)}
					</div>
					<div className="flex-col ">
						<div className="label ">
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
							<p className="text-red-500  mt-2">{errors.name}</p>
						)}
					</div>
				</div>

				<div className="h-8" />
				<h2 className="text-xl font-bold text-start mb-2">
					Game Course
				</h2>
				<div
					className="grid md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4 px-6 pb-4 pt-2 bg-gray-700 text-white  rounded-xl
				dark:[color-scheme:dark]"
				>
					<div>
						<div className="label">
							<span className="label-text">
								Select Courses to Search
							</span>
						</div>
						<div className="w-full text-black ">
							<select
								className="select select-primary w-full  bg-white"
								value={selectCourse?.website_path}
								onChange={(e) => {
									let course = coursesData.find(
										(c) => c.website_path == e.target.value
									);

									if (course != null) {
										setSelectCourses(course);
										setCourseIds([]);
										// setCourseIds(
										// 	course.courses.map(
										// 		(c) => c.course_id
										// 	)
										// );
									}
								}}
							>
								<option disabled selected>
									Choose Your Course
								</option>
								{coursesData?.map((c) => (
									<option
										key={c.website_path}
										value={c.website_path}
									>
										{c.course_title}
									</option>
								))}
							</select>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 mt-4  gap-y-1 md:gap-y-0 gap-x-0 md:gap-x-8 items-center">
							{selectCourse?.courses.map((course) => {
								if (course.course_name != "") {
									return (
										<div
											className="form-control"
											key={course.course_id}
										>
											<label className="cursor-pointer label">
												<span className="label-text text-lg text-left mr-4">
													{course.course_name}
												</span>
												<input
													type="checkbox"
													name={course.course_name}
													value={course.course_id}
													className="checkbox checkbox-success checkbox-md custom-checkbox"
													checked={courseIds?.includes(
														course.course_id
													)}
													onChange={
														handleCheckboxChange
													}
												/>
											</label>
										</div>
									);
								}
							})}
						</div>
						{errors.courses && (
							<p className="text-red-500  mt-2 text-center">
								{errors.courses}
							</p>
						)}
					</div>
					<div>
						<label className="form-control w-full ">
							<div className="label">
								<span className="label-text">
									Select Resident type (if applicable)
								</span>
							</div>
							<select
								className="select select-bordered"
								onChange={(e) => {
									setBookingClass(e.target.value);
								}}
								value={bookingClass}
							>
								{Object.keys(BOOKING_CLASS_DATA).map((k, i) => (
									<option
										key={`select-${i}`}
										className="text-black"
										value={k}
									>
										{k}
									</option>
								))}
							</select>
						</label>
					</div>
				</div>

				<div className="h-8" />
				<h2 className="text-xl font-bold text-start mb-2">
					Email Configuration
				</h2>
				<div
					className="grid md:grid-cols-1 grid-cols-1 gap-x-6 gap-y-4 px-6 pb-4 pt-2 bg-gray-700 text-white  rounded-xl
				dark:[color-scheme:dark]"
				>
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
				</div>

				<div className="h-8" />

				<div className="flex space-x-2 justify-center">
					<button
						className="btn bg-blue-500 md:w-1/3 w-full text-lg h-16 text-white hover:bg-blue-600"
						type="submit"
					>
						Add Reservation
					</button>
				</div>
			</form>
		</div>
	);
}
