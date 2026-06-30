import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Acceder a la página de login
    await page.goto('http://localhost:5176/login', { waitUntil: 'networkidle' });
    console.log('✓ Página de login cargada');
    
    // Hacer login (usar credenciales de prueba)
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    // Esperar a que se redirija a home
    await page.waitForURL('**/home', { timeout: 5000 }).catch(() => {
      console.log('No redirigió a /home, continuando...');
    });
    
    // Acceder a la página de pronósticos
    await page.goto('http://localhost:5176/pronosticos', { waitUntil: 'networkidle' });
    console.log('✓ Página de pronósticos cargada');
    
    // Tomar captura de pantalla
    await page.screenshot({ path: 'pronosticos_screenshot.png', fullPage: true });
    console.log('✓ Captura de pantalla guardada');
    
    // Verificar elementos clave
    const titulos = await page.locator('h2.pr-section-title').allTextContents();
    console.log('\n📋 Secciones encontradas:');
    titulos.forEach(t => console.log('  -', t.trim()));
    
    const botonHome = await page.locator('.pr-btn-home').count();
    console.log('\n🏠 Botón "Volver al Home":', botonHome > 0 ? '✓ Encontrado' : '✗ No encontrado');
    
    // Verificar si hay partidos finalizados
    const tarjetasFinalizadas = await page.locator('.pr-card-finalizado').count();
    console.log('🏁 Tarjetas de partidos finalizados:', tarjetasFinalizadas);
    
    // Verificar resultados en grande
    const resultadosReales = await page.locator('.pr-resultado-real').allTextContents();
    console.log('⚽ Resultados reales encontrados:', resultadosReales.length);
    if (resultadosReales.length > 0) {
      console.log('  Ejemplos:', resultadosReales.slice(0, 3).map(r => r.trim()));
    }
    
    // Verificar puntos
    const puntosElements = await page.locator('.pr-puntos').count();
    console.log('🎯 Secciones de puntos:', puntosElements);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
