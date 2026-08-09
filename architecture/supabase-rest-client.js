/* Supabase transport boundary. Domain code should not construct REST headers. */
(function (global) {
  'use strict';
  function createSupabaseRestClient(config) {
    config = config || {};
    return async function request(path, options) {
      options = options || {};
      const token = await config.ensureSession();
      if (!token) throw new Error('يلزم تسجيل الدخول');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs || 10000);
      const { headers: extraHeaders = {}, timeoutMs, ...fetchOptions } = options;
      const send = () => fetch(config.url + '/rest/v1/' + path, {
        headers: { apikey: config.key, Authorization: 'Bearer ' + config.accessToken(), 'Content-Type': 'application/json', Prefer: 'return=representation', ...extraHeaders },
        signal: controller.signal, ...fetchOptions
      });
      try {
        let response = await send();
        if (response.status === 401 && config.refreshSession) {
          if (await config.refreshSession()) response = await send();
        }
        if (!response.ok) {
          const detail = await response.text().catch(() => '');
          throw new Error('Supabase ' + response.status + ': ' + detail.slice(0, 180));
        }
        if (response.status === 204) return null;
        return await response.json().catch(() => null);
      } catch (error) {
        if (error.name === 'AbortError') throw new Error('انتهت مهلة الاتصال قبل تأكيد الحفظ');
        throw error;
      } finally { clearTimeout(timer); }
    };
  }
  global.PharmacySupabaseRestClient = Object.freeze({ create: createSupabaseRestClient });
}(window));
