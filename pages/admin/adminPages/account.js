import React, {  useEffect, useRef, useState } from 'react'
import api from '../../api/darlink'
import { USER_ENDPOINTS } from '../../api/ACTIONS.JS'
import {useRouter} from 'next/router'
import { USER } from '../../api/ACTIONS.JS'
import UserInfo from '../../../components/verify'
import DeleteModal from '../../../components/DeleteModal'
import { toast } from 'react-toastify'
import { ResetUser } from '../../../context/context'
import Button from '../../../container/button'


export default function Account() {

  const [values, setValues] = useState({
    currentPassword: '',
    newPassword:'',
    cornfirm_newPassword:'',
  })
 const emailRef = useRef(null);
 const usernameRef = useRef(null);
  const [user, setUser] = useState({
    username: '',
    email: '',
  })

  const [isDisabled, setDisabled] = useState(true)
  const [active, setActive] = useState(false)

  const [error, setError] = useState('')
  const router = useRouter()
  const formRef = useRef()

  const clearData = () =>{
    values.cornfirm_newPassword='',
    values.newPassword=''
    values.currentPassword=''
  }

 

const handleChange = (e) => {
  setUser({...user, [e.target.name]:e.target.value});
}

  const handleEditUser = async (e) => {
    e.preventDefault()
    try { 
      setActive(true)
        const { data } = await api.patch(USER.UPDATE_USER_INFO(), {
          username:usernameRef.current.value,
          email:emailRef.current.value
        })
        setActive(false)
        if (data.success) {         
          router.push('/accounts')
        } 
    } catch (error) {
      setActive(false)
      toast.error(error.response.data.error)
      if (error.response.status === 401) {
        // toast.error(error.response.data.error)
        ResetUser()
        router.push('/Login')
      }
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (values.newPassword !== values.cornfirm_newPassword) {
        setError(true)
      }else{
        setActive(true)
        const { data } = await api.patch(USER_ENDPOINTS.RESET_LOGIN(), {
          ...values,
        })
        setActive(false)
        if (data.success) {
          formRef.current?.reset()
          clearData()
          router.push('/accounts')
        } 
      }
    } catch (error) {
      setActive(false)
      toast.error(error.response.data.error)
      if (error.response.status === 401) {
        // toast.error(error.response.data.error)
        ResetUser()
        router.push('/Login')
      }
    }
  }


  useEffect(() =>{
    const AuthenticateUser = async () => {
      try {
        const { data } = await api.post(USER_ENDPOINTS.CHECK(), {})
        if (!data.success) router.push('/Login')
      } catch (error) {
        toast.error(error.response.data.error)
        router.push('/Login')
      }
    }
    const infor = UserInfo();
    user.username = infor.username
    user.email = infor.email
    AuthenticateUser();
  }, [])


  return (
    <>
      <div>
        <div>
          <div className="-mt-5 md:-mt-24 xl:w-5/6 ml-20 md:ml-0">
            <div className="">
              <h1 className="text-[#8BC940] font-semibold text-3xl">Account</h1>
              <div className=""></div>
            </div>
          </div>
          <section className="-mb-36">
            <div class=" items-center w-full max-w-screen-lg xl:w-5/6 p-6 pb-6 mt-10 gap-6 relative bg-white rounded-lg shadow-xl sm:p-8">
              <h1 className="text-3xl font-semibold">User Info</h1>

              <div className="text- mt-12   ">
                <form
                  onSubmit={handleEditUser}
                  className="Avenir w-full  xl:w-4/4      "
                >
                  <div className="relative  mb-3 ">
                    <label className="ml-2 text-sm font-semibold uppercase text-gray-700">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-5  placeholder-gray-400 focus:ring-[#8BC940]
                   text-gray-700 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring  w-full"
                      placeholder="JohnDoe@gmail.com"
                      style={{ transition: 'all .15s ease' }}
                      name="email"
                      ref={emailRef}
                      value={user.email}
                      onChange={(e) => {
                        handleChange(e)
                      }}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="ml-2 text-sm font-semibold uppercase text-gray-700">
                      USERNAME
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-5 focus:ring-[#8BC940]  placeholder-gray-400 text-gray-700 bg-gray-50 rounded
                         text-sm shadow focus:outline-none focus:ring w-full"
                      placeholder="USERNAME"
                      ref={usernameRef}
                      value={user.username}
                      style={{ transition: 'all .15s ease' }}
                      name="username"
                      onChange={(e) => {
                        handleChange(e)
                      }}
                    />
                  </div>

                  <div>
                    <label className=" items-center cursor-pointer ">
                      <div className="">
                        <label className="ml-2 text-sm font-semibold text-gray-700 flex gap-2">
                          CUSTOM DOMAIN{' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-4"
                            viewBox="0 0 20 20"
                            //   fill='currentColor'
                            fill="#8BC940 "
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </label>
                        <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <label className="inline-flex relative items-center w-full cursor-pointer">
                            <input
                              id="customCheckLogin"
                              type="checkbox"
                              value=""
                              className="sr-only peer"
                              style={{ transition: 'all .15s ease' }}
                              disabled={isDisabled}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="text-center mt-6 float- items-end ">
                   
                    <Button
                      type="submit"
                      disabled={active}
                      label={active ? 'Saving...' : 'Save'}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Pages box */}

            <div class=" items-center w-full max-w-screen-lg xl:w-5/6 p-6 pb-6 mt-10 gap-6 bg-white rounded-lg shadow-xl sm:p-8">
              <h1 className="text-3xl font-semibold">Pages</h1>

              <div className="text- mt-12   ">
                <form className=" w-full  xl:w-4/4      ">
                  <div className="relative  mb- border p-5 items-center flex justify-between ">
                    <div className="">
                      <p className="text-md font-normal">Airlink</p>
                    </div>
                    <div className="">
                      <button className="bg-[#8BC940] text-white uppercase font-semibold px-2 border-0 text-sm p-1">
                        current
                      </button>
                    </div>
                  </div>
                  <div className="relative  mb-3 border p-5  ">
                    <div className="flex gap-2 items-center">
                      <p className="text-md font-normal">Collaburator</p>
                    </div>
                  </div>

                  <div className="relative w-full mb-3 flex gap-4 ">
                    <div className="w-2/3">
                      <label className="ml-2 text-sm font-semibold uppercase text-gray-400">
                        USERNAME
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-5 focus:ring-[#8BC940]  placeholder-gray-400 text-gray-700 bg-gray-50 rounded
                         text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="USERNAME"
                        value="airlink"
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>
                    <div className="text-center mt-6 float- w-1/3 ">
                     
                      <Button
                        type="submit"
                        disabled={active}
                        label={active ? 'Saving...' : 'Save'}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* password box */}

            <div class=" items-center w-full max-w-screen-lg p-6 xl:w-5/6 pb-6 mt-10 relative  gap-6 bg-white rounded-lg shadow-xl sm:p-8">
              <h1 className="text-3xl font-semibold">Password</h1>

              <div className="text- mt-12   ">
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="Avenir w-full  xl:w-4/4      "
                >
                  <div className="relative  mb-3 ">
                    <label className="ml-2 text-sm font-semibold uppercase text-gray-700">
                      CURRENT
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-5 placeholder-gray-400 
                   text-gray-700 bg-gray-50 rounded text-sm shadow focus:ring-[#8BC940]  focus:outline-none focus:ring  w-full"
                      placeholder="CURRENT"
                      style={{ transition: 'all .15s ease' }}
                      name="currentPassword"
                      onChange={(e) => {
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="relative w-full mb-3 flex gap-3">
                    <div className="w-1/2">
                      <label className="ml-2 text-sm font-semibold uppercase text-gray-700">
                        new
                      </label>
                      <input
                        type="password"
                        className="border-0 px-3 py-5 placeholder-gray-400 text-gray-700 bg-gray-50 rounded
                         text-sm shadow focus:outline-none focus:ring focus:ring-[#8BC940]  w-full"
                        placeholder="Enter yout new password"
                        style={{ transition: 'all .15s ease' }}
                        name="newPassword"
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                        }}
                      />
                    </div>

                    <div className="w-1/2">
                      <label className="ml-2 text-sm font-semibold uppercase text-gray-700">
                        confirm
                      </label>
                      <input
                        type="password"
                        className="border-0 px-3 py-5 placeholder-gray-400 text-gray-700 bg-gray-50 rounded
                         text-sm shadow focus:outline-none focus:ring-[#8BC940] focus:ring w-full"
                        placeholder="Enter yout new password(again)"
                        style={{ transition: 'all .15s ease' }}
                        name="cornfirm_newPassword"
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="border inline-block">
                    {/* <p className="p-1 mx-4 text-[#8BC940] font-normal text-sm">
                      Enable Two-Factor Authentication
                    </p> */}
                  </div>

                  <div className="text-center  mt-6 float- items-end ">
                    
                    <Button
                      type="submit"
                      disabled={active}
                      label={active ? 'Saving...' : 'Save'}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="flex justify-between py-16 bottom-1   xl:w-5/6 -mb-8 ">
              <div className="">
                <p className="text-red-600 cursor-pointer underline">
                  <DeleteModal />
                </p>
              </div>
              <div className=" text-gray-400">
                <p>Terms. Privact policy</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
