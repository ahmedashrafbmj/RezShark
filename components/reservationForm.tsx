export default function ReservationForm() {
	return (
		<div className="flex-col justify-start text-center items-center px-6 py-8 bg-slate-100">
			<span className="text-2xl font-bold text-black ">
				Tee Time Reservation Finder
			</span>

			<form className="space-y-8">
				<div className="md:flex justify-between mt-4 md:space-x-10">
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
							/>
						</label>
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
								value={""}
							/>
						</label>
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
									placeholder="Password"
									value={""}
								/>
							</label>
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
									placeholder="Password"
									value={""}
								/>
							</label>
						</div>
						<div className="flex-col w-full">
							<div className="label mt-1">
								<span className="label-text">Latest Time</span>
							</div>
							<label className="input input-bordered flex items-center gap-2">
								<input
									type="time"
									className="grow"
									placeholder="Password"
									value={""}
								/>
							</label>
						</div>
						<div className="flex-col w-full">
							<div className="label mt-1">
								<span className="label-text">Player Count</span>
							</div>
							<label className="input input-bordered flex items-center gap-2">
								<input
									type="number"
									className="grow"
									placeholder="Count"
									value={""}
								/>
							</label>
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
									value={""}
								/>
							</label>
						</div>
					</div>
					<div className="flex-1  bg-slate-700  rounded-xl   p-4 text-white">
						<span className="label-text text-lg font-bold">
							Select Courses to Search
						</span>
						<div className="grid grid-cols-1 lg:grid-cols-2 mt-4  gap-y-1 md:gap-y-0 gap-x-0 md:gap-x-8">
							<div className="form-control ">
								<label className="cursor-pointer label">
									<span className="label-text text-lg">
										Black
									</span>
									<input
										type="checkbox"
										defaultChecked={true}
										className="checkbox checkbox-success
                                    checkbox-md"
									/>
								</label>
							</div>
							<div className="form-control ">
								<label className="cursor-pointer label">
									<span className="label-text text-lg">
										Blue
									</span>
									<input
										type="checkbox"
										defaultChecked={true}
										className="checkbox checkbox-success
                                    checkbox-md"
									/>
								</label>
							</div>
							<div className="form-control ">
								<label className="cursor-pointer label">
									<span className="label-text text-lg">
										Red
									</span>
									<input
										type="checkbox"
										defaultChecked={true}
										className="checkbox checkbox-success
                                    checkbox-md"
									/>
								</label>
							</div>
							<div className="form-control ">
								<label className="cursor-pointer label">
									<span className="label-text text-lg">
										Green
									</span>
									<input
										type="checkbox"
										defaultChecked={true}
										className="checkbox checkbox-success
                                    checkbox-md"
									/>
								</label>
							</div>

							<div className="form-control ">
								<label className="cursor-pointer label">
									<span className="label-text text-lg">
										Yellow
									</span>
									<input
										type="checkbox"
										defaultChecked={true}
										className="checkbox checkbox-success
                                    checkbox-md"
									/>
								</label>
							</div>
						</div>
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
							/>
						</label>
					</div>
					<div className="flex-col w-full">
						<div className="label mt-1">
							<span className="label-text">
								Booking Confirmation Email CC&apos;s
							</span>
						</div>
						<textarea
							placeholder="mail@gmail.com"
							className="textarea textarea-bordered textarea-md w-full "
						></textarea>
					</div>

					<div className="form-control items-center ">
						<label className="cursor-pointer label space-x-4">
							<input
								type="checkbox"
								defaultChecked={true}
								className="checkbox checkbox-success
                                checkbox-md"
							/>
							<span className="label-text text-lg">
								Hide in Background
							</span>
						</label>
					</div>
				</div>

				<div className="flex space-x-2 justify-center">
					<button
						className="btn bg-purple-500 w-1/3 text-lg h-16 text-white hover:bg-purple-400"
						type="submit"
					>
						Start
					</button>
					<button
						className="btn bg-red-500 hover:bg-red-400 w-1/3 text-lg h-16 text-white"
						type="submit"
					>
						Stop
					</button>
				</div>
			</form>
		</div>
	);
}
