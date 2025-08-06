export default {
  // 路由国际化
  route: {
    dashboard: 'ホーム',
    document: 'プロジェクトドキュメント'
  },
  // ログインページ国際化
  login: {
    selectPlaceholder: '会社名を選択または入力してください',
    username: 'ユーザー名',
    password: 'パスワード',
    login: 'ログイン',
    logging: 'ログイン中...',
    code: '認証コード',
    rememberPassword: 'パスワードを記憶する',
    switchRegisterPage: '今すぐ登録',
    rule: {
      tenantId: {
        required: 'テナントIDを入力してください'
      },
      username: {
        required: 'アカウントを入力してください'
      },
      password: {
        required: 'パスワードを入力してください'
      },
      code: {
        required: '認証コードを入力してください'
      }
    },
    social: {
      wechat: 'WeChatログイン',
      maxkey: 'MaxKeyログイン',
      topiam: 'TopIamログイン',
      gitee: 'Giteeログイン',
      github: 'Githubログイン'
    }
  },
  // 登録ページ国際化
  register: {
    selectPlaceholder: '会社名を選択または入力してください',
    username: 'ユーザー名',
    password: 'パスワード',
    confirmPassword: 'パスワードの確認',
    register: '登録',
    registering: '登録中...',
    registerSuccess: 'おめでとうございます！アカウント {username} の登録が成功しました！',
    code: '認証コード',
    switchLoginPage: '既存のアカウントでログイン',
    rule: {
      tenantId: {
        required: 'テナントIDを入力してください'
      },
      username: {
        required: 'アカウントを入力してください',
        length: 'ユーザー名は {min} から {max} 文字の間でなければなりません'
      },
      password: {
        required: 'パスワードを入力してください',
        length: 'パスワードは {min} から {max} 文字の間でなければなりません',
        pattern: '不正な文字を含むことはできません：{strings}'
      },
      code: {
        required: '認証コードを入力してください'
      },
      confirmPassword: {
        required: 'パスワードを再度入力してください',
        equalToPassword: '入力したパスワードが一致しません'
      }
    }
  },
  // ナビゲーションバー国際化
  navbar: {
    full: 'フルスクリーン',
    language: '言語',
    dashboard: 'ホーム',
    document: 'プロジェクトドキュメント',
    message: 'メッセージ',
    layoutSize: 'レイアウトサイズ',
    selectTenant: 'テナント選択',
    layoutSetting: 'レイアウト設定',
    personalCenter: '個人センター',
    logout: 'ログアウト'
  }
};
