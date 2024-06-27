"use client";
import Header from "@/components/header";
import { withAuth } from "@/components/withAuth";
import { useUserStore } from "@/utils/store";

function UsersDetails() {
	const user = useUserStore((state) => state.user);

	return (
		<div className="flex-col ">
			<Header title="Your Profile Details" showBack />

			<div className="modal-box  max-w-none  w-full bg-white ">
				<div className="py-4">
					<table className="table mt-4">
						<tbody>
							<tr className="bg-gray-600 text-white text-lg">
								<td>Column Names</td>
								<td>Values</td>
							</tr>
							<tr>
								<td className="border-r-2 text-lg font-bold">
									Email
								</td>
								<td>
									<span className="text-base">
										{user?.email}
									</span>
								</td>
							</tr>
							<tr>
								<td className="border-r-2 text-lg font-bold">
									First Name
								</td>
								<td>
									<span className="text-base">
										{user?.first_name}
									</span>
								</td>
							</tr>
							<tr>
								<td className="border-r-2 text-lg font-bold">
									Last Name
								</td>
								<td>
									<span className="text-base">
										{user?.last_name}
									</span>
								</td>
							</tr>
							<tr>
								<td className="border-r-2 text-lg font-bold">
									Nickname
								</td>
								<td>{user?.nickname}</td>
							</tr>
							<tr>
								<td className="border-r-2 text-lg font-bold">
									Birthday
								</td>
								<td>{user?.birthday}</td>
							</tr>
							<tr>
								<td className="border-r-2 text-lg font-bold">
									City
								</td>
								<td>{user?.city}</td>
							</tr>
							<tr>
								<td className="border-r-2 text-lg font-bold">
									State
								</td>
								<td>{user?.state}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default withAuth(UsersDetails);
