import type { GetAutomationsResponse } from '@types-app/api';

// ─────────────────────────────────────────────
// Mock data — simulates GET /automations
// ─────────────────────────────────────────────
const MOCK_AUTOMATIONS: GetAutomationsResponse = {
  actions: [
    {
      id:          'send_email',
      label:       'Send Email',
      description: 'Send an automated email to one or more recipients.',
      category:    'Communication',
      parameters:  [
        {
          key:         'to',
          label:       'Recipient Email',
          type:        'text',
          required:    true,
          placeholder: 'employee@company.com',
        },
        {
          key:         'subject',
          label:       'Subject',
          type:        'text',
          required:    true,
          placeholder: 'Welcome to the team!',
        },
        {
          key:         'template',
          label:       'Email Template',
          type:        'select',
          required:    true,
          options:     ['welcome', 'offer_letter', 'reminder', 'rejection', 'custom'],
        },
      ],
    },
    {
      id:          'slack_notify',
      label:       'Slack Notification',
      description: 'Post a message to a Slack channel.',
      category:    'Communication',
      parameters:  [
        {
          key:         'channel',
          label:       'Channel',
          type:        'text',
          required:    true,
          placeholder: '#hr-notifications',
        },
        {
          key:         'message',
          label:       'Message',
          type:        'text',
          required:    true,
          placeholder: 'New hire onboarding started',
        },
        {
          key:          'mention_user',
          label:        'Mention Assignee',
          type:         'boolean',
          required:     false,
          defaultValue: 'false',
        },
      ],
    },
    {
      id:          'create_jira_ticket',
      label:       'Create Jira Ticket',
      description: 'Automatically create a Jira issue for tracking.',
      category:    'Project Management',
      parameters:  [
        {
          key:         'project_key',
          label:       'Project Key',
          type:        'text',
          required:    true,
          placeholder: 'HR',
        },
        {
          key:         'issue_type',
          label:       'Issue Type',
          type:        'select',
          required:    true,
          options:     ['Task', 'Story', 'Bug', 'Epic'],
          defaultValue: 'Task',
        },
        {
          key:         'summary',
          label:       'Summary',
          type:        'text',
          required:    true,
          placeholder: 'New employee onboarding checklist',
        },
        {
          key:         'priority',
          label:       'Priority',
          type:        'select',
          required:    false,
          options:     ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
          defaultValue: 'Medium',
        },
      ],
    },
    {
      id:          'update_hris',
      label:       'Update HRIS Record',
      description: 'Push updated employee data to your HRIS system.',
      category:    'HR Systems',
      parameters:  [
        {
          key:         'system',
          label:       'HRIS System',
          type:        'select',
          required:    true,
          options:     ['Workday', 'BambooHR', 'ADP', 'SAP SuccessFactors'],
        },
        {
          key:         'employee_id_field',
          label:       'Employee ID Field',
          type:        'text',
          required:    true,
          placeholder: 'employee_id',
          defaultValue: 'employee_id',
        },
        {
          key:         'status',
          label:       'New Status',
          type:        'select',
          required:    true,
          options:     ['active', 'inactive', 'on_leave', 'terminated'],
        },
      ],
    },
    {
      id:          'generate_document',
      label:       'Generate Document',
      description: 'Generate an HR document from a template (offer letter, contract, etc.).',
      category:    'Documents',
      parameters:  [
        {
          key:         'template_id',
          label:       'Document Template',
          type:        'select',
          required:    true,
          options:     ['offer_letter', 'nda', 'employment_contract', 'termination_letter'],
        },
        {
          key:         'output_format',
          label:       'Output Format',
          type:        'select',
          required:    true,
          options:     ['pdf', 'docx', 'html'],
          defaultValue: 'pdf',
        },
        {
          key:          'send_to_employee',
          label:        'Email to Employee',
          type:         'boolean',
          required:     false,
          defaultValue: 'true',
        },
      ],
    },
    {
      id:          'schedule_interview',
      label:       'Schedule Interview',
      description: 'Book an interview slot via calendar integration.',
      category:    'Recruiting',
      parameters:  [
        {
          key:         'interviewer_email',
          label:       'Interviewer Email',
          type:        'text',
          required:    true,
          placeholder: 'manager@company.com',
        },
        {
          key:         'duration_minutes',
          label:       'Duration (minutes)',
          type:        'number',
          required:    true,
          defaultValue: '60',
          placeholder: '60',
        },
        {
          key:         'meeting_type',
          label:       'Meeting Type',
          type:        'select',
          required:    true,
          options:     ['Video Call', 'Phone Screen', 'In-Person', 'Panel'],
          defaultValue: 'Video Call',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// API — simulates network latency
// ─────────────────────────────────────────────
export const automationsApi = {
  getAutomations: async (): Promise<GetAutomationsResponse> => {
    await new Promise((r) => setTimeout(r, 400)); // simulate 400ms network
    return MOCK_AUTOMATIONS;
  },
};
