import React, {useState, useCallback} from 'react';

const mergeDateAndTime = (date, timeSlot) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
  };
const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill([startTime])
    .reduce((acc, _, i) =>
      acc.concat([startTime + (i * increment)]));

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
    const totalSlots = (salonClosesAt - salonOpensAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;
   
    return timeIncrements(totalSlots,startTime,increment);
   
  };
const weeklyDateValues = (startDate) => {
    const midnight = new Date(startDate).setHours(0, 0, 0, 0);
    const increment = 24 * 60 * 60 * 1000;

    return timeIncrements(7,midnight,increment);
   
/*     return Array(7)
      .fill([midnight])
      .reduce((acc, _, i) =>
        acc.concat([midnight + (i * increment)])
      ); */
  };

const toShortDate = timestamp => {
    const [day, , dayOfMonth] = new Date(timestamp)
      .toDateString()
      .split(' ');
    return `${day} ${dayOfMonth}`;
  };

const toTimeValue = timestamp =>
        new Date(timestamp).toTimeString().substring(0, 5);


const TimeSlotTable = ({
                salonOpensAt,
                salonClosesAt,
                today,
                availableTimeSlots,
                checkedTimeSlot,
                handleChange
    }) => {
        const timeSlots = dailyTimeSlots(
            salonOpensAt,
            salonClosesAt
            );
        const dates = weeklyDateValues(today);
        return (
              <table id="time-slots">
              <thead>
              <tr>
                <th />
                {dates.map(d => (
                    <th key={d}>{toShortDate(d)}</th>
                  ))}
              </tr>
            </thead>
              <tbody>
                      {timeSlots.map(timeSlot => (
                        <tr key={timeSlot}>
                          <th>{toTimeValue(timeSlot)}</th>
                          {dates.map(date => (
                            <td key={date}>
                            <RadioButtonIfAvailable
                            availableTimeSlots={availableTimeSlots}
                            date={date}
                            timeSlot={timeSlot}
                            checkedTimeSlot={checkedTimeSlot}
                            handleChange={handleChange}
                          />
                            </td>
                          ))}
                        </tr>
                      ))}
              </tbody>
              </table>
                );
      };

const RadioButtonIfAvailable = ({
        availableTimeSlots,
        date,
        timeSlot,
        checkedTimeSlot,
        handleChange
      }) => {
        const startsAt = mergeDateAndTime(date, timeSlot);
        if (
          availableTimeSlots.some(availableTimeSlot =>
            availableTimeSlot.startsAt === startsAt
          )
        ) {
          return (
            <input
              name="startsAt"
              type="radio"
              value={startsAt}
              checked={isChecked}
              onChange={handleChange}
            />);
        }
        return null;
      };      
export const AppointmentForm = ({
    selectableServices,
    service,
    onSubmit,
    salonOpensAt,
    salonClosesAt,
    today,
    availableTimeSlots
}) => {
    const [selectedService, setSelectedService] = useState(service);

    const handleChange = (e) => {
        setSelectedService(e.target.value);
        console.log(e.target.value);
    }
    const handleStartsAtChange = useCallback(
        ({ target: { value } }) =>
          setAppointment(appointment => ({
            ...appointment,
            startsAt: parseInt(value)
          })),
        []
      );
    return(
    <form id="appointment" onSubmit={() => onSubmit(appointment)}  >
    <label htmlFor="service"> Salon service </label>
        <select 
            id="service"
            name="service" 
            value={service}
            onChange={handleChange}
         >
            <option />
            {selectableServices.map(s => (
             <option 
                key={s}
             >{s}
                </option>
              ))}
        </select>
        <TimeSlotTable 
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={availableTimeSlots}
        checkedTimeSlot={appointment.startsAt}
        handleChange={handleStartsAtChange} 
        />
        <input type="submit" value="Add" />
    </form>
    );
};

AppointmentForm.defaultProps = {
    availableTimeSlots: [],
    today: new Date(),
    salonOpensAt: 9,
    salonClosesAt: 19,
    selectableServices: [
      'Cut',
      'Blow-dry',
      'Cut & color',
      'Beard trim',
      'Cut & beard trim',
      'Extensions']
  };