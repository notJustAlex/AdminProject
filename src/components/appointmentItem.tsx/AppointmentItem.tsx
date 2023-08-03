import { useEffect, useState, memo } from "react";
import dayjs from "dayjs";
import { Optional } from "utility-types";

import { IAppointment } from "../../shared/interfaces/appointment.interface";

import "./appointmentItem.scss";

type AppointmentProps = Optional<IAppointment, "canceled"> & {
	openModal?: (state: number) => void;
};

const AppointmentItem = memo(
	({
		id,
		name,
		date,
		service,
		phone,
		canceled,
		openModal,
	}: AppointmentProps) => {
		const [timeLeft, changeTimeLeft] = useState(
			`${dayjs(date).diff(undefined, "hours")}:${
				dayjs(date).diff(undefined, "minute") % 60
			}`
		);

		useEffect(() => {
			const intervalId = setInterval(() => {
				changeTimeLeft(
					`${dayjs(date).diff(undefined, "hours")}:${
						dayjs(date).diff(undefined, "minute") % 60
					}`
				);
			}, 60000);

			return () => {
				clearInterval(intervalId);
			};
		}, [date]);

		const formatedDate = dayjs(date).format("DD/MM/YYYY HH:mm");
		return (
			<div className="appointment">
				<div className="appointment__info">
					<span className="appointment__date">Date: {formatedDate}</span>
					<span className="appointment__name">Name: {name}</span>
					<span className="appointment__service">Service: {service}</span>
					<span className="appointment__phone">Phone: {phone}</span>
				</div>
				{!canceled && openModal ? (
					<>
						<div className="appointment__time">
							<span>Time left:</span>
							<span className="appointment__timer">{timeLeft}</span>
						</div>
						<button
							className="appointment__cancel"
							onClick={() => {
								if (openModal) openModal(id);
							}}
						>
							Cancel
						</button>
					</>
				) : null}
				{canceled ? (
					<div className="appointment__canceled">Canceled</div>
				) : null}
			</div>
		);
	}
);

export default AppointmentItem;
