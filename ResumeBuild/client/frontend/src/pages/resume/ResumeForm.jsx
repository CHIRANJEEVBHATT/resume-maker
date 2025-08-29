import React from 'react'

const Section = ({ title, children, action }) => (
  <div className="bg-white rounded-2xl shadow-md p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {action}
    </div>
    <div className="grid grid-cols-1 gap-3">{children}</div>
  </div>
)

const Input = (props) => (
  <input {...props} className={`border rounded-md p-2 w-full ${props.className || ''}`} />
)
const Textarea = (props) => (
  <textarea {...props} className={`border rounded-md p-2 w-full ${props.className || ''}`} />
)

const arrayUpdate = (arr, idx, patch) => arr.map((item, i) => (i === idx ? { ...item, ...patch } : item))

const ResumeForm = ({ value, onChange, onSubmit, submitting }) => {
  const update = (path, val) => {
    const parts = path.split('.')
    const next = { ...value }
    let cur = next
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i]
      cur[key] = cur[key] ? { ...cur[key] } : {}
      cur = cur[key]
    }
    cur[parts[parts.length - 1]] = val
    onChange(next)
  }

  const addItem = (key, empty) => onChange({ ...value, [key]: [ ...(value[key] || []), empty ] })
  const removeItem = (key, idx) => onChange({ ...value, [key]: (value[key] || []).filter((_, i) => i !== idx) })
  const updateItem = (key, idx, patch) => onChange({ ...value, [key]: arrayUpdate(value[key] || [], idx, patch) })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Section title="Personal Info">
        <Input placeholder="Title (required)" value={value.title || ''} onChange={(e)=>onChange({ ...value, title: e.target.value })} />
        <Input placeholder="Full Name" value={value.personalInfo?.fullName || ''} onChange={(e)=>update('personalInfo.fullName', e.target.value)} />
        <Input placeholder="Designation" value={value.personalInfo?.designation || ''} onChange={(e)=>update('personalInfo.designation', e.target.value)} />
        <Textarea placeholder="Summary" rows={3} value={value.personalInfo?.summary || ''} onChange={(e)=>update('personalInfo.summary', e.target.value)} />
      </Section>

      <Section title="Contact Info">
        <Input placeholder="Email" value={value.contact?.email || ''} onChange={(e)=>update('contact.email', e.target.value)} />
        <Input placeholder="Phone" value={value.contact?.phone || ''} onChange={(e)=>update('contact.phone', e.target.value)} />
        <Input placeholder="Location" value={value.contact?.location || ''} onChange={(e)=>update('contact.location', e.target.value)} />
        <Input placeholder="GitHub" value={value.contact?.github || ''} onChange={(e)=>update('contact.github', e.target.value)} />
        <Input placeholder="Website" value={value.contact?.website || ''} onChange={(e)=>update('contact.website', e.target.value)} />
      </Section>

      <Section title="Work Experience" action={<button type="button" onClick={()=>addItem('workExperience', { company:'', position:'', startDate:'', endDate:'', description:'' })} className="px-3 py-1 text-sm rounded-md bg-gray-900 text-white">Add</button>}>
        {(value.workExperience || []).map((w, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border rounded-md p-3">
            <div className="flex justify-between gap-2">
              <Input placeholder="Company" value={w.company || ''} onChange={(e)=>updateItem('workExperience', i, { company: e.target.value })} />
              <Input placeholder="Position" value={w.position || ''} onChange={(e)=>updateItem('workExperience', i, { position: e.target.value })} />
            </div>
            <div className="flex justify-between gap-2">
              <Input type="date" placeholder="Start" value={w.startDate ? String(w.startDate).slice(0,10) : ''} onChange={(e)=>updateItem('workExperience', i, { startDate: e.target.value })} />
              <Input type="date" placeholder="End" value={w.endDate ? String(w.endDate).slice(0,10) : ''} onChange={(e)=>updateItem('workExperience', i, { endDate: e.target.value })} />
            </div>
            <Textarea placeholder="Description" rows={3} value={w.description || ''} onChange={(e)=>updateItem('workExperience', i, { description: e.target.value })} />
            <div className="text-right"><button type="button" onClick={()=>removeItem('workExperience', i)} className="text-sm text-red-600">Remove</button></div>
          </div>
        ))}
      </Section>

      <Section title="Education" action={<button type="button" onClick={()=>addItem('education', { institution:'', degree:'', startDate:'', endDate:'', grade:'' })} className="px-3 py-1 text-sm rounded-md bg-gray-900 text-white">Add</button>}>
        {(value.education || []).map((eItem, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border rounded-md p-3">
            <div className="flex justify-between gap-2">
              <Input placeholder="Institution" value={eItem.institution || ''} onChange={(e)=>updateItem('education', i, { institution: e.target.value })} />
              <Input placeholder="Degree" value={eItem.degree || ''} onChange={(e)=>updateItem('education', i, { degree: e.target.value })} />
            </div>
            <div className="flex justify-between gap-2">
              <Input type="date" placeholder="Start" value={eItem.startDate ? String(eItem.startDate).slice(0,10) : ''} onChange={(e)=>updateItem('education', i, { startDate: e.target.value })} />
              <Input type="date" placeholder="End" value={eItem.endDate ? String(eItem.endDate).slice(0,10) : ''} onChange={(e)=>updateItem('education', i, { endDate: e.target.value })} />
            </div>
            <Input placeholder="Grade" value={eItem.grade || ''} onChange={(e)=>updateItem('education', i, { grade: e.target.value })} />
            <div className="text-right"><button type="button" onClick={()=>removeItem('education', i)} className="text-sm text-red-600">Remove</button></div>
          </div>
        ))}
      </Section>

      <Section title="Projects" action={<button type="button" onClick={()=>addItem('projects', { title:'', description:'', technologies:[], projectLink:'', githubLink:'' })} className="px-3 py-1 text-sm rounded-md bg-gray-900 text-white">Add</button>}>
        {(value.projects || []).map((p, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border rounded-md p-3">
            <Input placeholder="Title" value={p.title || ''} onChange={(e)=>updateItem('projects', i, { title: e.target.value })} />
            <Textarea placeholder="Description" rows={3} value={p.description || ''} onChange={(e)=>updateItem('projects', i, { description: e.target.value })} />
            <Input placeholder="Technologies (comma separated)" value={(p.technologies || []).join(', ')} onChange={(e)=>updateItem('projects', i, { technologies: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} />
            <div className="flex justify-between gap-2">
              <Input placeholder="Project Link" value={p.projectLink || ''} onChange={(e)=>updateItem('projects', i, { projectLink: e.target.value })} />
              <Input placeholder="GitHub Link" value={p.githubLink || ''} onChange={(e)=>updateItem('projects', i, { githubLink: e.target.value })} />
            </div>
            <div className="text-right"><button type="button" onClick={()=>removeItem('projects', i)} className="text-sm text-red-600">Remove</button></div>
          </div>
        ))}
      </Section>

      <Section title="Skills" action={<button type="button" onClick={()=>addItem('skills', { name:'', progress:0 })} className="px-3 py-1 text-sm rounded-md bg-gray-900 text-white">Add</button>}>
        {(value.skills || []).map((s, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border rounded-md p-3">
            <div className="flex justify-between gap-2 items-center">
              <Input placeholder="Skill" value={s.name || ''} onChange={(e)=>updateItem('skills', i, { name: e.target.value })} />
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="100" value={Number(s.progress) || 0} onChange={(e)=>updateItem('skills', i, { progress: Number(e.target.value) })} />
                <span className="text-sm w-10 text-right">{Number(s.progress) || 0}%</span>
              </div>
            </div>
            <div className="text-right"><button type="button" onClick={()=>removeItem('skills', i)} className="text-sm text-red-600">Remove</button></div>
          </div>
        ))}
      </Section>

      <Section title="Certifications" action={<button type="button" onClick={()=>addItem('certifications', { name:'', organization:'', issueDate:'' })} className="px-3 py-1 text-sm rounded-md bg-gray-900 text-white">Add</button>}>
        {(value.certifications || []).map((c, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border rounded-md p-3">
            <div className="flex justify-between gap-2">
              <Input placeholder="Name" value={c.name || ''} onChange={(e)=>updateItem('certifications', i, { name: e.target.value })} />
              <Input placeholder="Organization" value={c.organization || ''} onChange={(e)=>updateItem('certifications', i, { organization: e.target.value })} />
            </div>
            <Input type="date" placeholder="Issue Date" value={c.issueDate ? String(c.issueDate).slice(0,10) : ''} onChange={(e)=>updateItem('certifications', i, { issueDate: e.target.value })} />
            <div className="text-right"><button type="button" onClick={()=>removeItem('certifications', i)} className="text-sm text-red-600">Remove</button></div>
          </div>
        ))}
      </Section>

      <Section title="Languages" action={<button type="button" onClick={()=>addItem('language', { name:'', progress:0 })} className="px-3 py-1 text-sm rounded-md bg-gray-900 text-white">Add</button>}>
        {(value.language || []).map((l, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border rounded-md p-3">
            <div className="flex justify-between gap-2 items-center">
              <Input placeholder="Language" value={l.name || ''} onChange={(e)=>updateItem('language', i, { name: e.target.value })} />
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="100" value={Number(l.progress) || 0} onChange={(e)=>updateItem('language', i, { progress: Number(e.target.value) })} />
                <span className="text-sm w-10 text-right">{Number(l.progress) || 0}%</span>
              </div>
            </div>
            <div className="text-right"><button type="button" onClick={()=>removeItem('language', i)} className="text-sm text-red-600">Remove</button></div>
          </div>
        ))}
      </Section>

      <Section title="Interests" action={<button type="button" onClick={()=>addItem('interest', '')} className="px-3 py-1 text-sm rounded-md bg-gray-900 text-white">Add</button>}>
        {(value.interest || []).map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input placeholder="Interest" value={it || ''} onChange={(e)=>onChange({ ...value, interest: (value.interest || []).map((x, idx)=> idx===i ? e.target.value : x) })} />
            <button type="button" onClick={()=>removeItem('interest', i)} className="text-sm text-red-600">Remove</button>
          </div>
        ))}
      </Section>

      <button disabled={submitting} className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
        {submitting ? 'Saving...' : 'Save Resume'}
      </button>
    </form>
  )
}

export default ResumeForm


