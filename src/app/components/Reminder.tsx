import { FC, useEffect, useState } from "react";
import { DatePicker, TimePicker } from "antd";
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

interface ReminderProps {
  reminder: Date | null;
  setReminder: (date: Date | null) => void;
}

const Reminder: FC<ReminderProps> = ({ reminder, setReminder }) => {
  const [date, setDate] = useState<Dayjs | null>(reminder ? dayjs(reminder) : null);
  const [time, setTime] = useState<Dayjs | null>(reminder ? dayjs(reminder) : null);

  useEffect(() => {
    if (date && time) {
      const combinedDate = date
        .hour(time.hour())
        .minute(time.minute())
        .second(time.second())
        .toDate();
      setReminder(dayjs(combinedDate).tz("Asia/Tokyo").toDate());
    } else {
      setReminder(null);
    }
  }, [date, time, setReminder]);

  useEffect(() => {
    if (reminder) {
      const timeUntilReminder = new Date(reminder).getTime() - new Date().getTime();
      if (timeUntilReminder > 0) {
        const timer = setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("リマインダー", {
              body: `リマインダーの時間です: ${dayjs(reminder).format('YYYY-MM-DD HH:mm:ss')}`,
            });
          }
        }, timeUntilReminder);
        return () => clearTimeout(timer);
      }
    }
  }, [reminder]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("通知が許可されました", {
            body: "リマインダーの通知を受け取ることができます。",
          });
        }
      });
    }
  }, []);

  return (
    <div className="mb-2">
      <label className="block mb-1">リマインダー日時</label>
      <DatePicker
        value={date}
        onChange={(date) => setDate(date)}
        className="mb-2"
      />
      <TimePicker
        value={time}
        onChange={(time) => setTime(time)}
      />
    </div>
  );
};

export default Reminder;