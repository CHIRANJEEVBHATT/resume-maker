import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../config/apiPaths'
import { useNavigate } from 'react-router-dom'
import ResumeForm from './ResumeForm.jsx'

const ResumeCreate = () => {
  const [value, setValue] = useState({ title: '', personalInfo: {}, contact: {}, skills: [], workExperience: [], education: [], projects: [], certifications: [], language: [], interest: [] })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!value.title || !value.title.trim()) {
        alert('Title is required')
        setSubmitting(false)
        return
      }
      const payload = { ...value }
      const { data } = await axiosInstance.post(API_PATHS.RESUME.CREATE, payload)
      navigate(`/resume/${data?._id || data?.id || ''}/edit`)
    } catch (err) {
      alert('Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Create Resume</h1>
      <ResumeForm value={value} onChange={setValue} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default ResumeCreate


