import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interface for components that can be checked for unsaved changes
 * before navigation away from the component
 */
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

/**
 * Guard to prevent navigation when there are unsaved changes
 * Shows a confirmation dialog to the user
 */
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (!component.canDeactivate) {
    return true;
  }
  
  return component.canDeactivate();
};
