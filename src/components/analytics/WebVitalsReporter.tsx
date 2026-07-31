"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Manda las métricas reales de Core Web Vitals (LCP, CLS, INP, FCP, TTFB) a
 * GA4, una por una, a medida que el navegador las mide. Sin esto, cualquier
 * cambio de performance (bundle, animaciones, imágenes) se hace a ciegas: no
 * hay forma de confirmar si mejoró o empeoró la experiencia real de las
 * visitas, solo suposiciones sobre el código.
 *
 * Patrón recomendado por la propia documentación de Next.js para mandar a
 * Google Analytics (CLS se manda *1000 porque GA4 solo acepta enteros).
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    window.gtag?.("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      metric_rating: metric.rating,
      page_path: window.location.pathname,
      non_interaction: true,
    });
  });

  return null;
}
