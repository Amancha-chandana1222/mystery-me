import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [revealed, setRevealed] = useState(false)
  const [decrypting, setDecrypting] = useState(false)
  const [terminalPrompt, setTerminalPrompt] = useState('who')
  const [terminalOutput, setTerminalOutput] = useState('')
  const [terminalTyping, setTerminalTyping] = useState(false)
  const [dashboardVisible, setDashboardVisible] = useState(false)
  const revealTimerRef = useRef(null)
  const terminalTypingRef = useRef(null)
  const missionTimerRef = useRef(null)
  const restartScrollFrameRef = useRef(null)
  const heroRef = useRef(null)
  const dashboardRef = useRef(null)
  const [dossierVisible, setDossierVisible] = useState(false)
  const dossierRef = useRef(null)
  const [scrollingLocked, setScrollingLocked] = useState(true)
  const [investigationStarted, setInvestigationStarted] = useState(false)
  const [missionVisible, setMissionVisible] = useState(false)
  const missionRef = useRef(null)
  const [missionTypewriter, setMissionTypewriter] = useState('')
  const missionText = 'Archive Successfully Accessed'
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const ringX = useRef(0)
  const ringY = useRef(0)
  const rafRef = useRef(null)
  const hoveredRef = useRef(false)
  const loadingTimersRef = useRef([])
  const [loadingVisible, setLoadingVisible] = useState(true)
  const [loadingFading, setLoadingFading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingGranted, setLoadingGranted] = useState(false)

  useEffect(() => {
    if (!revealed) return undefined
    const el = dossierRef.current
    if (!el) return undefined
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDossierVisible(true)
        obs.disconnect()
      }
    }, { threshold: 0.25 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [revealed])

  useEffect(() => {
    if (!dossierVisible) return undefined
    const el = missionRef.current
    if (!el) return undefined
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setMissionVisible(true)
        obs.disconnect()
      }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [dossierVisible])

  useEffect(() => {
    const steps = [
      { delay: 0, progress: 0 },
      { delay: 650, progress: 25 },
      { delay: 1300, progress: 52 },
      { delay: 1950, progress: 81 },
      { delay: 2600, progress: 100 },
    ]

    loadingTimersRef.current = steps.map(({ delay, progress }) => window.setTimeout(() => {
      setLoadingProgress(progress)

      if (progress === 100) {
        setLoadingGranted(true)
        const hideTimer = window.setTimeout(() => {
          setLoadingFading(true)
          const unmountTimer = window.setTimeout(() => {
            setLoadingVisible(false)
          }, 650)
          loadingTimersRef.current.push(unmountTimer)
        }, 1000)
        loadingTimersRef.current.push(hideTimer)
      }
    }, delay))

    return () => {
      loadingTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      loadingTimersRef.current = []
    }
  }, [])

  useEffect(() => {
    // Desktop-only custom cursor implementation
    const isTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || navigator.maxTouchPoints > 0)
    if (isTouch) return undefined

    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    if (!dot || !ring) return undefined

    document.body.classList.add('use-custom-cursor')

    const onPointerMove = (e) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
    }

    const onEnter = () => { hoveredRef.current = true }
    const onLeave = () => { hoveredRef.current = false }

    const loop = () => {
      // dot follows exactly
      const x = mouseX.current
      const y = mouseY.current

      // ring lags behind
      ringX.current += (x - ringX.current) * 0.14
      ringY.current += (y - ringY.current) * 0.14

      const scaleDot = hoveredRef.current ? 1.6 : 1
      const scaleRing = hoveredRef.current ? 1.42 : 1

      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scaleDot})`
      ring.style.transform = `translate3d(${ringX.current}px, ${ringY.current}px, 0) translate(-50%, -50%) scale(${scaleRing})`

      rafRef.current = window.requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onPointerMove)

    // attach hover listeners to interactive elements
    const interactives = Array.from(document.querySelectorAll('button, a, input, textarea, select'))
    interactives.forEach((el) => {
      el.addEventListener('pointerenter', onEnter)
      el.addEventListener('pointerleave', onLeave)
    })

    rafRef.current = window.requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      interactives.forEach((el) => {
        el.removeEventListener('pointerenter', onEnter)
        el.removeEventListener('pointerleave', onLeave)
      })
      window.cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('use-custom-cursor')
    }
  }, [])

  const downloadDossier = () => {
  const a = document.createElement('a')
  a.href = '/resume.pdf'
  a.download = 'Amancha_Chandana_Resume.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

  const terminalResponses = {
    who: 'I am AI CHANDU TERMINAL, a secure interface built to reveal identity, skills, and future mission through a cyber-futuristic command layer.',
    goals: 'My goals are to grow into a strong space-tech professional, contribute to meaningful systems, and keep building with discipline, curiosity, and precision.',
    technologies: 'Java, DSA, HTML, CSS, JavaScript, React, Node.js, MongoDB, Git/GitHub, DBMS, Operating Systems, Problem Solving, Analytical Thinking, Teamwork, Communication, and Time Management.',
    projects: 'I have built futuristic portfolio-style interfaces, interactive reveal sections, and cyber-themed React experiences that combine motion, glassmorphism, and responsive layouts.',
  }

  const terminalButtons = [
    { key: 'who', label: 'Who are you?' },
    { key: 'goals', label: 'What are your goals?' },
    { key: 'technologies', label: 'What technologies do you know?' },
    { key: 'projects', label: 'What projects have you built?' },
  ]

  const scrollToAbout = () => {
    setInvestigationStarted(true)
    setScrollingLocked(false)

    window.requestAnimationFrame(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current)
      }
      if (terminalTypingRef.current) {
        window.clearInterval(terminalTypingRef.current)
      }
      if (missionTimerRef.current) {
        window.clearInterval(missionTimerRef.current)
      }
      if (restartScrollFrameRef.current) {
        window.cancelAnimationFrame(restartScrollFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Manage scroll lock: prevent wheel, touchmove and keyboard scrolling when locked
    const preventDefault = (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const onKey = (e) => {
      // Keys that cause scrolling
      const keys = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        'Space',
        ' ',
        'Spacebar',
      ]
      if (keys.includes(e.key) || keys.includes(e.code)) {
        preventDefault(e)
      }
    }

    if (scrollingLocked) {
      window.addEventListener('wheel', preventDefault, { passive: false })
      window.addEventListener('touchmove', preventDefault, { passive: false })
      window.addEventListener('keydown', onKey, { passive: false })
      // also hide body overflow as defensive measure
      document.body.style.overflow = 'hidden'
    } else {
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }

    return () => {
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [scrollingLocked])

  useEffect(() => {
    if (!revealed) {
      return undefined
    }

    if (terminalTypingRef.current) {
      window.clearInterval(terminalTypingRef.current)
    }

    const response = terminalResponses[terminalPrompt]
    let nextIndex = 0

    setTerminalOutput('')
    setTerminalTyping(true)

    terminalTypingRef.current = window.setInterval(() => {
      nextIndex += 1
      setTerminalOutput(response.slice(0, nextIndex))

      if (nextIndex >= response.length) {
        window.clearInterval(terminalTypingRef.current)
        terminalTypingRef.current = null
        setTerminalTyping(false)
      }
    }, 24)

    return () => {
      if (terminalTypingRef.current) {
        window.clearInterval(terminalTypingRef.current)
        terminalTypingRef.current = null
      }
    }
  }, [revealed, terminalPrompt])

  useEffect(() => {
    if (!revealed) {
      return undefined
    }

    const element = dashboardRef.current

    if (!element) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDashboardVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [revealed])

  const handleEvidenceClick = () => {
    if (decrypting || revealed) {
      return
    }

    setDecrypting(true)
    revealTimerRef.current = window.setTimeout(() => {
      setRevealed(true)
      setDecrypting(false)
    }, 2000)
  }

  const resetAll = () => {
    if (revealTimerRef.current) {
      window.clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
    if (terminalTypingRef.current) {
      window.clearInterval(terminalTypingRef.current)
      terminalTypingRef.current = null
    }
    if (missionTimerRef.current) {
      window.clearInterval(missionTimerRef.current)
      missionTimerRef.current = null
    }

    setDecrypting(false)
    setRevealed(false)
    setDashboardVisible(false)
    setDossierVisible(false)
    setTerminalOutput('')
    setTerminalTyping(false)
    setTerminalPrompt('who')
    setMissionVisible(false)
    setMissionTypewriter('')
    setInvestigationStarted(false)
    // lock navigation again to replay from hero
    setScrollingLocked(true)

    if (restartScrollFrameRef.current) {
      window.cancelAnimationFrame(restartScrollFrameRef.current)
    }
    restartScrollFrameRef.current = window.requestAnimationFrame(() => {
      heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      restartScrollFrameRef.current = null
    })
  }

  useEffect(() => {
    if (!missionVisible) return undefined
    let idx = 0
    missionTimerRef.current = window.setInterval(() => {
      idx += 1
      setMissionTypewriter(missionText.slice(0, idx))
      if (idx >= missionText.length) {
        window.clearInterval(missionTimerRef.current)
        missionTimerRef.current = null
      }
    }, 60)
    return () => {
      if (missionTimerRef.current) {
        window.clearInterval(missionTimerRef.current)
        missionTimerRef.current = null
      }
    }
  }, [missionVisible])

  const scrollToTop = () => {
    resetAll()
  }

  const overlayText = revealed ? 'IDENTITY CONFIRMED' : decrypting ? 'DECRYPTING...' : 'CLICK TO DECRYPT'

  const dashboardMetrics = [
    { label: 'Java Skill', value: 95 },
    { label: 'DSA Progress', value: 85 },
    { label: 'React Development', value: 80 },
    { label: 'Problem Solving', value: 92 },
    { label: 'GATE Preparation', value: 50 },
    { label: 'ISRO Mission Readiness', value: 70 },
  ]

  return (
    <>
      {loadingVisible && (
        <div className={`loading-overlay ${loadingFading ? 'is-fading' : 'is-visible'}`} role="status" aria-live="polite" aria-label="Loading database">
          <div className="loading-stars" aria-hidden="true" />
          <div className="loading-particles" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} className={`loading-particle loading-particle-${index + 1}`} />
            ))}
          </div>
          <div className="loading-panel">
            <p className="loading-eyebrow">CLASSIFIED SYSTEM INITIALIZATION</p>
            <h2>ACCESSING DATABASE...</h2>
            <div className="loading-progress-text">{loadingGranted ? 'ACCESS GRANTED ✓' : `${loadingProgress}%`}</div>
            <div className="loading-progress-track">
              <div className="loading-progress-fill" style={{ width: `${loadingProgress}%` }} />
            </div>
            <div className="loading-scan" aria-hidden="true" />
          </div>
        </div>
      )}

    <main className="landing-page">
      <div ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {!investigationStarted && (
        <section ref={heroRef} className="hero-shell" aria-label="Unknown entity detected landing page">
          <p className="eyebrow">CLASSIFIED SIGNAL // INTERCEPTED</p>

          <h1>UNKNOWN ENTITY DETECTED</h1>

          <p className="subtitle">Identity Hidden...</p>

          <button type="button" className="discover-button" onClick={scrollToAbout}>
            DISCOVER
          </button>
          {scrollingLocked && (
            <p className="lock-notice" aria-live="polite">Navigation Locked - Press DISCOVER to Continue</p>
          )}
        </section>
      )}

      <section id="about" className="about-section" aria-label="Access level one unlocked">
        <div className="about-shell">
          <p className="about-eyebrow">RESTRICTED PROFILE</p>
          <h2>ACCESS LEVEL 1 UNLOCKED</h2>

          <div className="card-grid">
            <article className="glass-card">
              <span className="card-label">Name</span>
              <h3>Amancha Chandana</h3>
            </article>

            <article className="glass-card">
              <span className="card-label">Occupation</span>
              <h3>Student</h3>
            </article>

            <article className="glass-card">
              <span className="card-label">Status</span>
              <h3>Active</h3>
            </article>
          </div>
        </div>
      </section>

      <section id="visual-evidence" className="evidence-section" aria-label="Visual evidence recovered">
        <div className="evidence-shell">
          <p className="evidence-eyebrow">FORENSIC ARCHIVE</p>
          <h2>VISUAL EVIDENCE RECOVERED</h2>

          <button
            type="button"
            className={`evidence-frame ${decrypting ? 'is-decrypting' : ''} ${revealed ? 'is-revealed' : ''}`}
            onClick={handleEvidenceClick}
            disabled={decrypting || revealed}
            aria-label={overlayText}
          >
            <img src="/myphoto.jpg" alt="Recovered visual evidence" className="evidence-image" />
            <span className="evidence-scan" aria-hidden="true" />
            <span
              className={`evidence-overlay ${decrypting ? 'evidence-overlay-decrypting' : ''} ${revealed ? 'evidence-overlay-revealed' : 'evidence-overlay-idle'}`}
            >
              {overlayText}
            </span>
          </button>
        </div>
      </section>

      {revealed && (
        <>
          <section id="level-2" className="level-two-section" aria-label="Access level two unlocked">
            <div className="level-two-shell">
            <p className="level-two-eyebrow">CONFIRMED ACCESS</p>
            <h2>ACCESS LEVEL 2 UNLOCKED</h2>

            <div className="level-two-grid">
              <article className="level-two-card">
                <span className="card-label">Mission</span>
                <p className="level-two-copy">
                  My mission is to join a leading space organization like ISRO as a Scientist,
                  Researcher, or Software Engineer and contribute to the advancement of space
                  technology and exploration.
                </p>
              </article>

              <article className="level-two-card">
                <span className="card-label">Current Status</span>
                <p className="level-two-copy">B.Tech CSE Student</p>
              </article>

              <article className="level-two-card">
                <span className="card-label">Primary Skills</span>
                <p className="level-two-copy">
                  Java, DSA, Web Development (HTML, CSS, JavaScript, React, Node.js), MongoDB,
                  Git/GitHub, DBMS, Operating Systems, Problem Solving, Analytical Thinking,
                  Teamwork, Communication, and Time Management.
                </p>
                <p className="level-two-copy level-two-copy-secondary">
                  Soft Skills: Problem Solving, Analytical Thinking, Teamwork, Communication,
                  Adaptability, Time Management, Continuous Learning, Leadership, and Attention
                  to Detail.
                </p>
              </article>

              <article className="level-two-card">
                <span className="card-label">Future Target</span>
                <p className="level-two-copy">Become a successful Software Engineer, contribute to environmental protection, and achieve financial independence. 🚀</p>
              </article>
            </div>
            </div>
          </section>

          <section id="ai-terminal" className="terminal-section" aria-label="AI Chandu terminal">
            <div className="terminal-shell">
              <p className="terminal-eyebrow">SECURE INTERFACE</p>
              <h2>AI CHANDU TERMINAL</h2>

              <div className="terminal-panel">
                <div className="terminal-header">
                  <span className="terminal-orb" />
                  <span>NEURAL LINK ESTABLISHED</span>
                </div>

                <div className="terminal-buttons" role="group" aria-label="Terminal prompts">
                  {terminalButtons.map((button) => (
                    <button
                      key={button.key}
                      type="button"
                      className={`terminal-button ${terminalPrompt === button.key ? 'is-active' : ''}`}
                      onClick={() => setTerminalPrompt(button.key)}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>

                <div className="terminal-screen" aria-live="polite">
                  <div className="terminal-line terminal-line-prompt">&gt; {terminalButtons.find((button) => button.key === terminalPrompt)?.label}</div>
                  <div className="terminal-line terminal-line-response">{terminalOutput}</div>
                  <span className={`terminal-cursor ${terminalTyping ? 'is-typing' : ''}`} aria-hidden="true">▍</span>
                </div>
              </div>
            </div>
          </section>

          <section
            id="mission-control"
            ref={dashboardRef}
            className="dashboard-section"
            aria-label="Mission control dashboard"
          >
            <div className="dashboard-shell">
              <p className="dashboard-eyebrow">SYSTEM TELEMETRY</p>
              <h2>MISSION CONTROL DASHBOARD</h2>

              <div className="dashboard-grid">
                {dashboardMetrics.map((metric, index) => (
                  <article key={metric.label} className={`dashboard-card ${dashboardVisible ? 'is-visible' : ''}`}>
                    <div className="dashboard-card-head">
                      <span className="card-label">{metric.label}</span>
                      <span className="dashboard-percent">{metric.value}%</span>
                    </div>

                    <div className="dashboard-bar-track" aria-hidden="true">
                      <div
                        className="dashboard-bar-fill"
                        style={{
                          '--metric-width': dashboardVisible ? `${metric.value}%` : '0%',
                          '--metric-delay': `${index * 120}ms`,
                        }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
        <section id="dossier" ref={dossierRef} className="dossier-section" aria-label="Classified dossier">
          <div className={`dossier-card ${dossierVisible ? 'is-visible' : ''}`}>
            <div className="dossier-head">
              <h3>CLASSIFIED DOSSIER</h3>
              <div className={`verified-stamp ${dossierVisible ? 'stamp-animate' : ''}`}>VERIFIED</div>
            </div>

            <div className="dossier-body">
              <dl>
                <dt>Name</dt>
                <dd>Amancha Chandana</dd>

                <dt>Status</dt>
                <dd>VERIFIED</dd>

                <dt>Education</dt>
                <dd>B.Tech CSE</dd>

                <dt>Mission</dt>
                <dd>Future Software Engineer</dd>

                <dt>Target Organizations</dt>
                <dd>ISRO, Top Tech Companies</dd>

                <dt>Clearance Level</dt>
                <dd>GRANTED</dd>
              </dl>

              <div className="dossier-actions">
                <button type="button" className="download-button" onClick={downloadDossier}>
                  DOWNLOAD DOSSIER
                </button>
              </div>

              <div className={`dossier-final ${dossierVisible ? 'is-visible' : ''}`}>
                IDENTITY CONFIRMED
              </div>
            </div>
          </div>
        </section>
        <section id="mission-complete" ref={missionRef} className={`mission-section ${missionVisible ? 'is-visible' : ''}`} aria-label="Mission complete">
          <div className="mission-stars" aria-hidden="true" />
          <div className="mission-inner">
            <svg className={`mission-check ${missionVisible ? 'play' : ''}`} width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="url(#g)" strokeWidth="0.8" fill="rgba(10,20,30,0.25)" />
              <path d="M7 13l3 3 7-7" stroke="#8fffdc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#5af2ff" />
                  <stop offset="1" stopColor="#8f7cff" />
                </linearGradient>
              </defs>
            </svg>

            <h2 className="mission-title">MISSION COMPLETE</h2>
            <p className="mission-subtitle">Thank you for accessing the archive.</p>

            <div className="mission-paragraphs">
              <p className="mission-paragraph">All classified records have been decrypted.</p>
              <p className="mission-paragraph">Identity verification complete.</p>
              <p className="mission-paragraph mission-typewriter" aria-live="polite">{missionTypewriter}</p>
              <p className="mission-paragraph">See you on the next mission.</p>
            </div>

            <p className="mission-note">Your visit has been recorded in the archive.</p>

            <button type="button" className="mission-restart" onClick={scrollToTop} aria-label="Restart investigation">RESTART INVESTIGATION</button>
          </div>
        </section>
    </main>
    </>
  )
}

export default App
