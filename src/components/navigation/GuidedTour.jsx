import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowLeft, X, ExternalLink, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const stepDestinations = {
  1: '/dashboard',
  2: '/dashboard',
  3: '/network',
  4: '/accounts?handle=@newsflash_0912',
  5: '/verification'
}

export function GuidedTour() {
  const { tourOpen, tourStep, tourSteps, nextTourStep, prevTourStep, closeTour } = useApp()
  const navigate = useNavigate()

  if (!tourOpen) return null

  const current = tourSteps.find(s => s.step === tourStep) || tourSteps[0]
  const destination = stepDestinations[tourStep]

  const handleJumpToFeature = () => {
    if (destination) {
      navigate(destination)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-panel border border-accent/40 rounded-xl shadow-2xl p-5 backdrop-blur-md relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-accent/20 text-accent">
                <Sparkles size={14} />
              </span>
              <span className="label text-accent font-semibold">{current.badge}</span>
              <span className="text-xs text-muted">
                Step {tourStep} of {tourSteps.length}
              </span>
            </div>
            <button
              type="button"
              onClick={closeTour}
              className="text-muted hover:text-white p-1 rounded transition-colors"
              aria-label="Dismiss guided tour"
            >
              <X size={16} />
            </button>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-white mb-1.5">{current.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {current.desc}
          </p>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {tourSteps.map(s => (
              <div
                key={s.step}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  s.step === tourStep
                    ? 'w-6 bg-accent'
                    : s.step < tourStep
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-line-light'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={handleJumpToFeature}
              className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
            >
              <span>Inspect view</span>
              <ExternalLink size={12} />
            </button>

            <div className="flex items-center gap-2">
              {tourStep > 1 && (
                <button
                  type="button"
                  onClick={prevTourStep}
                  className="btn-ghost text-xs px-2.5 py-1.5"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={nextTourStep}
                className="btn text-xs px-3 py-1.5"
              >
                {tourStep === tourSteps.length ? (
                  <>
                    <CheckCircle size={13} />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
