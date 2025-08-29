import Resume from "../models/resumeModel.js";
import fs from 'fs'
import path from 'path';

const mapRequestToModel = (body) => {
  const mapped = { ...body }
  if (body.personalInfo) {
    mapped.profileInfo = {
      ...(body.profileInfo || {}),
      fullName: body.personalInfo.fullName || '',
      designation: body.personalInfo.designation || '',
      summary: body.personalInfo.summary || '',
      profilePreviewUrl: body.personalInfo.profilePreviewUrl || (body.profileInfo?.profilePreviewUrl || ''),
    }
    delete mapped.personalInfo
  }
  if (body.contact) {
    mapped.contactInfo = {
      ...(body.contactInfo || {}),
      email: body.contact.email || '',
      phone: body.contact.phone || '',
      location: body.contact.location || '',
      github: body.contact.github || '',
      website: body.contact.website || '',
    }
    delete mapped.contact
  }
  if (Array.isArray(body.skills)) {
    mapped.skills = body.skills.map(s => ({ name: s.name, progress: Number(s.progress) || 0 }))
  }
  return mapped
}

const mapModelToResponse = (doc) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc }
  return {
    ...obj,
    personalInfo: {
      fullName: obj.profileInfo?.fullName || '',
      designation: obj.profileInfo?.designation || '',
      summary: obj.profileInfo?.summary || '',
      profilePreviewUrl: obj.profileInfo?.profilePreviewUrl || '',
    },
    contact: {
      email: obj.contactInfo?.email || '',
      phone: obj.contactInfo?.phone || '',
      location: obj.contactInfo?.location || '',
      github: obj.contactInfo?.github || '',
      website: obj.contactInfo?.website || '',
    },
  }
}
export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const defaultResume = {
      userId: req.user.id,   
      title,
      thumbnailLink: "",
      template: "default",
      colorPalette: ["#000000", "#ffffff"],

      profileInfo: {
        profilePreviewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },

      contactInfo: {
        email: "",
        phone: "",
        location: "",
        github: "",
        website: "",
      },

      workExperience: [],

      education: [],

      projects: [],

      skills: [],

      certifications: [],

      language: [],

      interest: [],
    };

    const mapped = mapRequestToModel(req.body)
    const resume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResume,
      ...mapped,
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserResume = async (req,res)=>{
     try{
        const resume = await Resume.find({userId : req.user._id}).sort({
            updatedAt :-1
        });
        res.json(resume)
     } catch(error){
            res.status(500).json({ success: false, message: error.message , message:"failed to get resume" });

     }
}

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    res.status(200).json(mapModelToResponse(resume));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get resume",
      error: error.message,
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({ _id: id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const mapped = mapRequestToModel(req.body)
    Object.assign(resume, mapped);

    const savedResume = await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: savedResume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update resume",
      error: error.message,
    });
  }
};


export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const uploadsFolder = path.join(process.cwd(), "uploads");

    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadsFolder,
        path.basename(resume.thumbnailLink)
      );
      if (fs.existsSync(oldThumbnail)) {
        await fs.promises.unlink(oldThumbnail);
      }
    }

    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(
        uploadsFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        await fs.promises.unlink(oldProfile);
      }
    }

    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to delete resume" });
    }

    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting resume",
      error: error.message,
    });
  }
};

export const getResumePdf = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })

    let PDFDocument
    try {
      ({ default: PDFDocument } = await import('pdfkit'))
    } catch (e) {
      return res.status(503).json({ message: 'PDF generation not available. Install pdfkit on the server.' })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"')

    const palette = Array.isArray(resume.colorPalette) && resume.colorPalette.length >= 2
      ? { primary: resume.colorPalette[0], secondary: resume.colorPalette[1] }
      : { primary: '#0EA5E9', secondary: '#64748B' } 

    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    doc.pipe(res)

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

    const bannerH = 90
    const left = doc.page.margins.left
    const top = doc.page.margins.top
    doc.save()
      .rect(left, top, pageWidth, bannerH)
      .fill(palette.primary)
      .restore()

    const header = resume.profileInfo || {}
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(22)
      .text(header.fullName || resume.title || 'Resume', left + 16, top + 18)
    if (header.designation) {
      doc.fillColor('#E5E7EB').font('Helvetica').fontSize(12)
        .text(header.designation, left + 16, top + 48)
    }

    const bodyStartY = top + bannerH + 20
    const leftColX = left
    const leftColW = 180
    const rightColX = left + leftColW + 20
    const rightColW = pageWidth - leftColW - 20

    const sectionHeader = (title, xPos, underlineW = 40) => {
      doc.fillColor(palette.primary).font('Helvetica-Bold').fontSize(12).text(title, xPos)
      const yLine = doc.y + 2
      doc.save().moveTo(xPos, yLine).lineTo(xPos + underlineW, yLine).lineWidth(3).strokeColor(palette.primary).stroke().restore()
      doc.moveDown(0.5)
    }

    const drawSkillBar = (name, pct, xPos, width) => {
      const barWidth = width
      const barHeight = 6
      const progress = Math.max(0, Math.min(100, Number(pct) || 0))
      const yText = doc.y
      doc.fillColor('#0F172A').font('Helvetica').fontSize(10).text(name || 'Skill', xPos, yText)
      const percentText = `${progress}%`
      const textWidth = doc.widthOfString(percentText)
      doc.text(percentText, xPos + barWidth - textWidth, yText)
      const startY = yText + 14
      doc.save()
      doc.roundedRect(xPos, startY, barWidth, barHeight, 3).fill('#E5E7EB')
      doc.roundedRect(xPos, startY, (barWidth * progress) / 100, barHeight, 3).fill(palette.primary)
      doc.restore()
      doc.moveDown(1.2)
    }

    doc.x = leftColX; doc.y = bodyStartY
    const c = resume.contactInfo || {}
    if ([c.email, c.phone, c.location, c.github, c.website].some(Boolean)) {
      sectionHeader('Contact', leftColX)
      doc.fillColor('#334155').font('Helvetica').fontSize(10)
      ;[c.email, c.phone, c.location, c.github, c.website].filter(Boolean).forEach(line => doc.text(line, { width: leftColW }))
      doc.moveDown(0.5)
    }

    if (Array.isArray(resume.skills) && resume.skills.length) {
      sectionHeader('Skills', leftColX)
      resume.skills.forEach(s => drawSkillBar(s.name || 'Skill', s.progress, leftColX, leftColW))
    }

    if (Array.isArray(resume.language) && resume.language.length) {
      sectionHeader('Languages', leftColX)
      resume.language.forEach(l => drawSkillBar(l.name || 'Language', l.progress, leftColX, leftColW))
    }

    doc.x = rightColX; doc.y = bodyStartY
    if (header.summary) {
      sectionHeader('Summary', rightColX)
      doc.fillColor('#334155').font('Helvetica').fontSize(10).text(header.summary, { width: rightColW })
    }

    if (Array.isArray(resume.workExperience) && resume.workExperience.length) {
      sectionHeader('Work Experience', rightColX)
      resume.workExperience.forEach(w => {
        const title = `${w.position || ''}${w.company ? ' @ ' + w.company : ''}`
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(11).text(title, rightColX)
        if (w.startDate || w.endDate) {
          const d1 = w.startDate ? new Date(w.startDate).toLocaleDateString() : ''
          const d2 = w.endDate ? new Date(w.endDate).toLocaleDateString() : 'Present'
          doc.fillColor(palette.secondary).font('Helvetica-Oblique').fontSize(9).text(`${d1} - ${d2}`, rightColX)
        }
        if (w.description) {
          doc.fillColor('#334155').font('Helvetica').fontSize(10).text(w.description, { width: rightColW })
        }
        doc.moveDown(0.6)
      })
    }

    if (Array.isArray(resume.education) && resume.education.length) {
      sectionHeader('Education', rightColX)
      resume.education.forEach(e => {
        const line = `${e.degree || ''}${e.institution ? ' - ' + e.institution : ''}`
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(11).text(line, rightColX)
        const d1 = e.startDate ? new Date(e.startDate).toLocaleDateString() : ''
        const d2 = e.endDate ? new Date(e.endDate).toLocaleDateString() : ''
        if (d1 || d2) doc.fillColor(palette.secondary).font('Helvetica-Oblique').fontSize(9).text(`${d1} ${d1 && d2 ? '-' : ''} ${d2}`, rightColX)
        if (e.grade) doc.fillColor('#334155').font('Helvetica').fontSize(10).text(`Grade: ${e.grade}`, rightColX)
        doc.moveDown(0.6)
      })
    }

    if (Array.isArray(resume.projects) && resume.projects.length) {
      sectionHeader('Projects', rightColX)
      resume.projects.forEach(p => {
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(11).text(p.title || 'Project', rightColX)
        if (p.description) doc.fillColor('#334155').font('Helvetica').fontSize(10).text(p.description, { width: rightColW })
        const links = [p.projectLink, p.githubLink].filter(Boolean).join('  |  ')
        if (links) doc.fillColor('#2563EB').font('Helvetica').fontSize(10).text(links, rightColX)
        doc.moveDown(0.6)
      })
    }

    if (Array.isArray(resume.certifications) && resume.certifications.length) {
      sectionHeader('Certifications', rightColX)
      resume.certifications.forEach(c => {
        const line = `${c.name || ''}${c.organization ? ' - ' + c.organization : ''}`
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(11).text(line, rightColX)
        if (c.issueDate) doc.fillColor(palette.secondary).font('Helvetica-Oblique').fontSize(9).text(new Date(c.issueDate).toLocaleDateString(), rightColX)
        doc.moveDown(0.4)
      })
    }

    if (Array.isArray(resume.interest) && resume.interest.length) {
      sectionHeader('Interests', rightColX)
      doc.fillColor('#334155').font('Helvetica').fontSize(10).text(resume.interest.filter(Boolean).join(', '), rightColX, doc.y, { width: rightColW })
    }

    doc.end()
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF', error: error.message })
  }
}
