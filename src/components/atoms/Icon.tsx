import {
  Kanban,
  Calendar,
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Archive,
  Settings,
  Paperclip,
  Tag,
  GripVertical,
  Inbox,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  Globe,
  Pencil,
  Trash2,
  Check,
  Users,
  User,
  Palette,
  LogOut,
  MoreHorizontal,
  Upload,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';

export type IconName =
  | 'board'
  | 'calendar'
  | 'search'
  | 'plus'
  | 'close'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'archive'
  | 'settings'
  | 'paperclip'
  | 'tag'
  | 'grip'
  | 'inbox'
  | 'alert'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'globe'
  | 'pencil'
  | 'trash'
  | 'check'
  | 'users'
  | 'user'
  | 'palette'
  | 'logout'
  | 'more'
  | 'upload'
  | 'message';

interface IconProps {
  name: IconName;
  className?: string;
}

const ICON_MAP: Record<IconName, LucideIcon> = {
  board: Kanban,
  calendar: Calendar,
  search: Search,
  plus: Plus,
  close: X,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  archive: Archive,
  settings: Settings,
  paperclip: Paperclip,
  tag: Tag,
  grip: GripVertical,
  inbox: Inbox,
  alert: AlertCircle,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  globe: Globe,
  pencil: Pencil,
  trash: Trash2,
  check: Check,
  users: Users,
  user: User,
  palette: Palette,
  logout: LogOut,
  more: MoreHorizontal,
  upload: Upload,
  message: MessageSquare,
};

export default function Icon({ name, className = 'size-4' }: IconProps) {
  const Component = ICON_MAP[name];
  if (!Component) return null;

  return (
    <Component
      className={className}
      aria-hidden="true"
      focusable="false"
      strokeWidth={1.8}
    />
  );
}
