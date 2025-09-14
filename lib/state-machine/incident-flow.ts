export const INCIDENT_STATES = {
  TRIGGERED: 'triggered',
  CONFIRMED: 'confirmed',
  CLASSIFIED: 'classified',
  CONTAINED: 'contained',
  RECOVERED: 'recovered',
  DOCUMENTED: 'documented',
  CLOSED: 'closed'
} as const

export const INCIDENT_STEPS = {
  TRIGGER: 'trigger',
  CONFIRM: 'confirm',
  CLASSIFY: 'classify',
  CONTAIN: 'contain',
  RECOVER: 'recover'
} as const

export type IncidentState = typeof INCIDENT_STATES[keyof typeof INCIDENT_STATES]
export type IncidentStep = typeof INCIDENT_STEPS[keyof typeof INCIDENT_STEPS]

export interface StateTransition {
  from: IncidentState
  to: IncidentState
  step?: IncidentStep
  requiredData?: string[]
}

export class IncidentStateMachine {
  private transitions: StateTransition[] = [
    { from: INCIDENT_STATES.TRIGGERED, to: INCIDENT_STATES.CONFIRMED, step: INCIDENT_STEPS.CONFIRM },
    { from: INCIDENT_STATES.CONFIRMED, to: INCIDENT_STATES.CLASSIFIED, step: INCIDENT_STEPS.CLASSIFY },
    { from: INCIDENT_STATES.CLASSIFIED, to: INCIDENT_STATES.CONTAINED, step: INCIDENT_STEPS.CONTAIN },
    { from: INCIDENT_STATES.CONTAINED, to: INCIDENT_STATES.RECOVERED, step: INCIDENT_STEPS.RECOVER },
    { from: INCIDENT_STATES.RECOVERED, to: INCIDENT_STATES.DOCUMENTED },
    { from: INCIDENT_STATES.DOCUMENTED, to: INCIDENT_STATES.CLOSED },
    // Allow closing from any state for false positives or emergency closure
    { from: INCIDENT_STATES.TRIGGERED, to: INCIDENT_STATES.CLOSED },
    { from: INCIDENT_STATES.CONFIRMED, to: INCIDENT_STATES.CLOSED },
    { from: INCIDENT_STATES.CLASSIFIED, to: INCIDENT_STATES.CLOSED },
    { from: INCIDENT_STATES.CONTAINED, to: INCIDENT_STATES.CLOSED },
    { from: INCIDENT_STATES.RECOVERED, to: INCIDENT_STATES.CLOSED },
  ]

  canTransition(from: IncidentState, to: IncidentState): boolean {
    return this.transitions.some(t => t.from === from && t.to === to)
  }

  getNextStates(currentState: IncidentState): IncidentState[] {
    return this.transitions
      .filter(t => t.from === currentState)
      .map(t => t.to)
  }

  getStepForTransition(from: IncidentState, to: IncidentState): IncidentStep | null {
    const transition = this.transitions.find(t => t.from === from && t.to === to)
    return transition?.step || null
  }

  getStateForStep(step: IncidentStep): IncidentState {
    const stepToStateMap: Record<IncidentStep, IncidentState> = {
      [INCIDENT_STEPS.TRIGGER]: INCIDENT_STATES.TRIGGERED,
      [INCIDENT_STEPS.CONFIRM]: INCIDENT_STATES.CONFIRMED,
      [INCIDENT_STEPS.CLASSIFY]: INCIDENT_STATES.CLASSIFIED,
      [INCIDENT_STEPS.CONTAIN]: INCIDENT_STATES.CONTAINED,
      [INCIDENT_STEPS.RECOVER]: INCIDENT_STATES.RECOVERED,
    }
    
    return stepToStateMap[step]
  }

  getStepForState(state: IncidentState): IncidentStep | null {
    const stateToStepMap: Partial<Record<IncidentState, IncidentStep>> = {
      [INCIDENT_STATES.TRIGGERED]: INCIDENT_STEPS.TRIGGER,
      [INCIDENT_STATES.CONFIRMED]: INCIDENT_STEPS.CONFIRM,
      [INCIDENT_STATES.CLASSIFIED]: INCIDENT_STEPS.CLASSIFY,
      [INCIDENT_STATES.CONTAINED]: INCIDENT_STEPS.CONTAIN,
      [INCIDENT_STATES.RECOVERED]: INCIDENT_STEPS.RECOVER,
    }
    
    return stateToStepMap[state] || null
  }

  getNextStep(currentStep: IncidentStep): IncidentStep | null {
    const steps = [
      INCIDENT_STEPS.TRIGGER,
      INCIDENT_STEPS.CONFIRM,
      INCIDENT_STEPS.CLASSIFY,
      INCIDENT_STEPS.CONTAIN,
      INCIDENT_STEPS.RECOVER
    ]
    
    const currentIndex = steps.indexOf(currentStep)
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null
  }

  getPreviousStep(currentStep: IncidentStep): IncidentStep | null {
    const steps = [
      INCIDENT_STEPS.TRIGGER,
      INCIDENT_STEPS.CONFIRM,
      INCIDENT_STEPS.CLASSIFY,
      INCIDENT_STEPS.CONTAIN,
      INCIDENT_STEPS.RECOVER
    ]
    
    const currentIndex = steps.indexOf(currentStep)
    return currentIndex > 0 ? steps[currentIndex - 1] : null
  }

  getAllSteps(): IncidentStep[] {
    return [
      INCIDENT_STEPS.TRIGGER,
      INCIDENT_STEPS.CONFIRM,
      INCIDENT_STEPS.CLASSIFY,
      INCIDENT_STEPS.CONTAIN,
      INCIDENT_STEPS.RECOVER
    ]
  }

  getStepIndex(step: IncidentStep): number {
    return this.getAllSteps().indexOf(step)
  }

  isValidState(state: string): state is IncidentState {
    return Object.values(INCIDENT_STATES).includes(state as IncidentState)
  }

  isValidStep(step: string): step is IncidentStep {
    return Object.values(INCIDENT_STEPS).includes(step as IncidentStep)
  }
}

export const incidentStateMachine = new IncidentStateMachine()