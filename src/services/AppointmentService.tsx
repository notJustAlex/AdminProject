import { useHttp } from "../hooks/http.hook";
import hasRequiredFields from "../utils/hasRequiredFields";
import dayjs from "dayjs";
import customParserFormat from "dayjs/plugin/customParseFormat";

import {
	IAppointment,
	ActiveAppointment,
} from "../shared/interfaces/appointment.interface";

dayjs.extend(customParserFormat);

const requiredFields = ["id", "date", "name", "service", "phone", "canceled"];

const useAppointmentService = () => {
	const { loadingStatus, request } = useHttp();

	const _apiBase = "http://localhost:3001/appointments";

	const getAllAppointments = async (): Promise<IAppointment[]> => {
		const result = await request({ url: _apiBase });
		if (
			result.every((item: IAppointment) =>
				hasRequiredFields(item, requiredFields)
			)
		) {
			return result;
		} else {
			throw new Error("Form is not filled out");
		}
	};

	const getAllActiveAppointments = async () => {
		const result = await getAllAppointments();
		const activeAppoitment: ActiveAppointment[] = result
			.filter(
				(item) =>
					!item.canceled && dayjs(item.date).diff(undefined, "minute") > 0
			)
			.map((item) => {
				return {
					id: item.id,
					date: item.date,
					name: item.name,
					service: item.service,
					phone: item.phone,
				};
			});
		return activeAppoitment;
	};

	const cancelAppointment = async (id: number) => {
		return await request({
			url: `${_apiBase}/${id}`,
			method: "PATCH",
			body: JSON.stringify({ canceled: true }),
		});
	};

	const createNewAppointment = async (appt: IAppointment) => {
		const id = new Date().getTime();
		appt["id"] = id;
		appt["date"] = dayjs(appt.date, "DD/MM/YYYY HH:mm").format(
			"YYYY-MM-DDTHH:mm"
		);
		return await request({
			url: _apiBase,
			method: "POST",
			body: JSON.stringify(appt),
		});
	};

	return {
		loadingStatus,
		getAllAppointments,
		getAllActiveAppointments,
		cancelAppointment,
		createNewAppointment,
	};
};

export default useAppointmentService;
