import { DecisionExceptionContext } from '../../interaction/contracts/DecisionExceptionContext';

export function DecisionBlockedPanel({
  exception,
}: {
  exception: DecisionExceptionContext;
}) {
  return (
    <div>
      <h3>Action blocked</h3>
      <p>{exception.failure_message}</p>
      <ul>
        {exception.escalation_options.map(o => (
          <li key={o.option_type}>
            {o.option_type} {o.permitted ? '' : '(not permitted)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
