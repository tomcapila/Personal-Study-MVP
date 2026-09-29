// Remove os dados de demonstração do build publicado.
import { rmSync } from 'node:fs'
rmSync(new URL('../dist/demo-data', import.meta.url), { recursive: true, force: true })
