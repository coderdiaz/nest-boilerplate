import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import sinon from 'sinon';

import { Env } from '../../env';
import { Context } from '../context.component';

@suite('unit Context component')
export class ContextComponentUnit {
  private ctx: Context;

  public async before() {
    await this.setupModule();
  }

  @test('create method should call createNamespace and the given callback')
  public create() {
    const obj = {
      cb: () => ({}),
    };
    const cbSpy = sinon.spy(obj, 'cb');
    this.ctx.create(obj.cb);
    expect(cbSpy.called).to.equal(true);
  }

  @test('requestId should call set method of the store')
  public response(done) {
    this.ctx.create(() => {
      const spy = sinon.spy(this.ctx.store, 'set');
      this.ctx.requestId = 'foo';
      expect(spy.called).to.equal(true);
      expect(this.ctx.requestId).to.equal('foo');
      done();
    });
  }

  private async setupModule() {
    const module = await Test.createTestingModule({
      components: [Context, Env],
    }).compile();

    this.ctx = module.get<Context>(Context);
  }
}
