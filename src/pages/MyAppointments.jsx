import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FcApproval } from "react-icons/fc";
import { assets } from '../assets/assets_frontend/assets';

const MyAppointments = () => {
  const [load, setLoad] = useState(true)
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
        setLoad(false)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getUserAppointments()
  }, [token])

  return (

    <div className='my-4'>
      <h1 className='pb-3 font-bold text-primary border-b text-xl'>My appointments</h1>
      {load ? (
        <p>Loading...</p>
      ) : appointments.length > 0 ? (
        <div>
          {appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='max-w-32 max-h-36 object-contain bg-indigo-50 dark:bg-slate-600 rounded-xl' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold dark:text-whi'>{item.docData.name}</p>
                <p className='dark:text-whi2'>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1 dark:text-whi'>Address:</p>
                <p className='text-xs dark:text-whi2'>{item.docData.address.line1}</p>
                <p className='text-xs dark:text-whi2'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1 dark:text-whi2'>
                  <span className='text-sm text-neutral-700 font-medium dark:text-whi'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'>
                    Cancel appointment
                  </button>
                )}
                {item.cancelled ?
                  (
                    <button className='text-sm text-stone-500 bg-red-200 cursor-not-allowed text-center sm:min-w-48 py-2 border rounded hover:bg-red-300 hover:text-stone-500 transition-all duration-300'>
                      Cancelled
                    </button>
                  )
                  : (
                    ""
                  )}
                {item.isCompleted && !item.cancelled ?
                  (
                    <p className='text-stone-500 bg-green-50 text-center sm:min-w-48 py-2 border rounded flex items-center gap-1 justify-center'>
                      <span className='text-bleck'>Completed</span><FcApproval className='text-xl' />
                    </p>
                  )
                  : (
                    ""
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='min-h-[70vh] max-h-[70vh] flex justify-center items-center'>
          <img className='h-[60vh]' src={assets.nodata} alt="" />
        </div>
        
      )}
    </div>

  )
}

export default MyAppointments