import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../config/apiPaths'
import ResumeForm from './ResumeForm.jsx'

const ResumeEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [value, setValue] = useState({ title:'', personalInfo: {}, contact: {}, skills: [], workExperience: [], education: [], projects: [], certifications: [], language: [], interest: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(id))
        setValue({
          title: data.title || '',
          personalInfo: data.personalInfo || {},
          contact: data.contact || {},
          skills: (data.skills || []).map(s => ({ name: s.name || '', progress: Number(s.progress) || 0 })),
          workExperience: data.workExperience || [],
          education: data.education || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
          language: (data.language || []).map(l => ({ name: l.name || '', progress: Number(l.progress) || 0 })),
          interest: data.interest || [],
        })
      } catch (err) {
        alert('Failed to load resume')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...value }
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(id), payload)
      navigate('/dashboard')
    } catch (err) {
      alert('Failed to update')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.RESUME.DOWNLOAD_PDF(id), { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to download PDF')
    }
  }

  if (loading) return <div className="py-10">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Resume</h1>
        <div className="flex gap-2">
          <button onClick={handleDownloadPdf} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">Download PDF</button>
        </div>
      </div>
      <ResumeForm value={value} onChange={setValue} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default ResumeEdit


