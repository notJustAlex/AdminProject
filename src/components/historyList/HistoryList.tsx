import { useContext, useEffect } from "react";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";

import AppointmentItem from "../appointmentItem.tsx/AppointmentItem";
import Error from "../error/Error";
import Spinner from "../spinner/Spinner";

function HistoryList() {
	const {
		getAppointments,
		allAppointments,
		appointmentLoadingStatus,
		calendarDate,
	} = useContext(AppointmentContext);

	useEffect(() => {
		getAppointments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [calendarDate]);

	if (appointmentLoadingStatus === "loading") {
		return <Spinner />;
	} else if (appointmentLoadingStatus === "error") {
		return (
			<>
				<Error />
				<button className="schedule__reload" onClick={getAppointments}>
					Try to Reoad Page
				</button>
			</>
		);
	}

	return (
		<>
			{allAppointments.length === 0 ? (
				<h2 className="no-data">No data to display</h2>
			) : null}

			{allAppointments.map((item) => {
				return <AppointmentItem {...item} key={item.id} />;
			})}
		</>
	);
}

export default HistoryList;
