import { Injectable } from '@nestjs/common'
import { version } from 'package.json'
import { valid, coerce } from 'semver'

@Injectable()
export class AppInfoService {
  get version(): string {
    return version
  }

  get coercedVersion(): string {
    const { version } = this
    return valid(version) ? coerce(version) : null
  }
}
