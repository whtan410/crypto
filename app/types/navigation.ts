/**
 * Navigation Type Definitions
 */

export type NavigationSection = 'account' | 'user' | 'report' | 'exception' | 'settings' | 'mock';

export interface TopNavigationPanelProps {
  activeSection?: NavigationSection;
  onSectionChange?: (section: NavigationSection) => void;
}
