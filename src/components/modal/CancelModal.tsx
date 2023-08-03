import Portal from "../portal/portal";
import { useRef, useEffect, useState, useContext } from "react";
import useAppointmentService from "../../services/AppointmentService";
import { CSSTransition } from "react-transition-group";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";

import "./modal.scss";

interface IModalProps {
	handleClose: (state: boolean) => void;
	selectedId: number;
	isOpen: boolean;
}

function CancelModal({ handleClose, selectedId, isOpen }: IModalProps) {
	const { getActiveAppointments } = useContext(AppointmentContext);

	const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
	const [cancelStatus, setCancelStatus] = useState<boolean | null>(null);

	const cancelStatusRef = useRef<boolean | null>(null);

	const { cancelAppointment } = useAppointmentService();

	const handleCancelAppointment = (id: number) => {
		setBtnDisabled(true);
		cancelAppointment(id)
			.then(() => {
				setCancelStatus(true);
			})
			.catch(() => {
				setCancelStatus(false);
				setBtnDisabled(false);
			});
	};

	const nodeRef = useRef<HTMLDivElement>(null);

	const closeOnEscapePressKey = (e: KeyboardEvent): void => {
		if (e.key === "Escape") {
			closeModal();
		}
	};

	const closeModal = () => {
		handleClose(false);
		if (cancelStatus || cancelStatusRef.current) {
			getActiveAppointments();
		}
	};

	useEffect(() => {
		cancelStatusRef.current = cancelStatus;
	}, [cancelStatus]);

	useEffect(() => {
		document.body.addEventListener("keydown", closeOnEscapePressKey);

		return () => {
			document.body.removeEventListener("keydown", closeOnEscapePressKey);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleClose]);

	return (
		<Portal>
			<CSSTransition
				in={isOpen}
				timeout={{ enter: 500, exit: 500 }}
				unmountOnExit
				classNames="modal"
				nodeRef={nodeRef}
			>
				<div className="modal" ref={nodeRef}>
					<div className="modal__body">
						<span className="modal__title">
							Are you sure you want to delete the appointment?
						</span>
						<div className="modal__btns">
							<button
								className="modal__ok"
								disabled={btnDisabled}
								onClick={() => handleCancelAppointment(selectedId)}
							>
								Ok
							</button>
							<button className="modal__close" onClick={() => closeModal()}>
								Close
							</button>
						</div>
						<div className="modal__status">
							{cancelStatus === null
								? ""
								: cancelStatus
								? "Success"
								: "Error, please try again"}
						</div>
					</div>
				</div>
			</CSSTransition>
		</Portal>
	);
}

export default CancelModal;
