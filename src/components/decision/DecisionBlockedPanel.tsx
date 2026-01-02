import { DecisionExceptionResponse } from '@/generated/turingos';

export function DecisionBlockedPanel({
  exception,
}: {
  exception: DecisionExceptionResponse;
}) {
  return (
    <div style={{ border: '1px solid #cc0000', padding: '1rem' }}>
      <h3>Action blocked</h3>
      <p>{exception.failure_message}</p>
      <ul>
        {exception.escalation_options.map(opt => (
          <li key={opt.option_type}>
            {opt.option_type}
            {!opt.permitted && (
              <span style={{ color: 'gray' }}>
                {' '}({opt.reason_if_blocked})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
