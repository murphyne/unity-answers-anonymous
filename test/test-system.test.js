import chai from 'chai';

describe('Test system', function () {
  it('assert.ok is working', function () {
    chai.assert.ok(true);
  });

  it('assert.equal is working', function () {
    chai.assert.equal(true, true);
  });

  it('assert.notEqual is working', function () {
    chai.assert.notEqual(true, false);
  });
});
