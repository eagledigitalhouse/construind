const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
const dayBeforePreviousDay = new Date(
  new Date().getTime() - 24 * 60 * 60 * 1000 * 2
);

export const profileUser = {
  id: 11,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  fullName: 'John Doe',
  role: 'admin',
  about:
    'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
  status: 'online',
  settings: {
    isTwoStepAuthVerificationEnabled: true,
    isNotificationsOn: false,
  },
};

export const contacts = [
  {
    id: 1,
    fullName: 'Felecia Rower',
    role: 'Frontend Developer',
    about:
      'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
  },
  {
    id: 2,
    fullName: 'Adalberto Granzin',
    role: 'UI/UX Designer',
    about:
      'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
  },
  {
    id: 3,
    fullName: 'Joaquina Weisenborn',
    role: 'Town planner',
    about:
      'Soufflé soufflé caramels sweet roll. Jelly lollipop sesame snaps bear claw jelly beans sugar plum sugar plum.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'busy',
  },
  {
    id: 4,
    fullName: 'Verla Morgano',
    role: 'Data scientist',
    about:
      'Chupa chups candy canes chocolate bar marshmallow liquorice muffin. Lemon drops oat cake tart liquorice tart cookie. Jelly-o cookie tootsie roll halvah.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
  },
  {
    id: 5,
    fullName: 'Margot Henschke',
    role: 'Dietitian',
    about:
      'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'busy',
  },
  {
    id: 6,
    fullName: 'Sal Piggee',
    role: 'Marketing executive',
    about:
      'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
  },
  {
    id: 7,
    fullName: 'Miguel Guelff',
    role: 'Special educational needs teacher',
    about:
      'Biscuit powder oat cake donut brownie ice cream I love soufflé. I love tootsie roll I love powder tootsie roll.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
  },
  {
    id: 8,
    fullName: 'Mauro Elenbaas',
    role: 'Advertising copywriter',
    about:
      'Bear claw ice cream lollipop gingerbread carrot cake. Brownie gummi bears chocolate muffin croissant jelly I love marzipan wafer.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'away',
  },
  {
    id: 9,
    fullName: 'Bridgett Omohundro',
    role: 'Designer, television/film set',
    about:
      'Gummies gummi bears I love candy icing apple pie I love marzipan bear claw. I love tart biscuit I love candy canes pudding chupa chups liquorice croissant.',
    avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'offline',
  },
  {
    id: 10,
    fullName: 'Zenia Jacobs',
    role: 'Building surveyor',
    about:
      'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'away',
  },
];

export const chats = [
  {
    id: 1,
    userId: 1,
    unseenMsgs: 0,
    chat: [
      {
        message: 'Hi',
        time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
        senderId: 11,
      },
      {
        message: 'Hello. How can I help You?',
        time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
        senderId: 1,
      },
      {
        message: 'Can I get details of my last transaction I made last month?',
        time: 'Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)',
        senderId: 11,
      },
      {
        message: 'We need to check if we can provide you such information.',
        time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
        senderId: 1,
      },
      {
        message: 'I will inform you as I get update on this.',
        time: 'Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)',
        senderId: 1,
      },
      {
        message: 'If it takes long you can mail me at my mail address.',
        time: dayBeforePreviousDay,
        senderId: 11,
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    unseenMsgs: 1,
    chat: [
      {
        message: 'How can we help? We\'re here for you!',
        time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
        senderId: 11,
      },
      {
        message:
          'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
        time: 'Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)',
        senderId: 2,
      },
      {
        message: 'It should be Bootstrap 5 compatible.',
        time: 'Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)',
        senderId: 2,
      },
      {
        message: 'Absolutely!',
        time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)',
        senderId: 11,
      },
      {
        message: 'Modern admin is the responsive bootstrap 5 admin template.!',
        time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
        senderId: 11,
      },
      {
        message: 'Looks clean and fresh UI.',
        time: 'Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)',
        senderId: 2,
      },
      {
        message: 'It\'s perfect for my next project.',
        time: 'Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)',
        senderId: 2,
      },
      {
        message: 'How can I purchase it?',
        time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)',
        senderId: 2,
      },
      {
        message: 'Thanks, from ThemeForest.',
        time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)',
        senderId: 11,
      },
      {
        message: 'I will purchase it for sure. 👍',
        time: previousDay,
        senderId: 2,
      },
    ],
  },
];

// Função para formatar tempo
export const formatTime = (time) => {
  if (!time) return '';
  
  const date = new Date(time);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  if (diffInHours < 1) {
    return 'agora';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d`;
  } else {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }
};