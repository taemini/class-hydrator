import {Hydrator, hydrate, dehydrate, serialize, deserialize, OnHydrate, OnDehydrate, Exclude} from '../index';
import './sampleClasses';

describe("Hydrator.classes",function(){
  class Arbitary{
    public thisIsForTest:string;
  }
  class OverwrittenClass{
    public thisIsForTest:number;
  }
  it('should provided with abiraty classes by Hydrator.provideClasses',function(){
    Hydrator.provideClasses([Arbitary]);
    expect(Hydrator.classes["Arbitary"]).toBe(Arbitary);
  });
  it('should be overwritten with arbitary classes by Hydrator.resetClasses', function(){
    Hydrator.resetClasses([OverwrittenClass]);
    expect(Hydrator.classes["Arbitary"]).toBeUndefined();
    expect(Hydrator.classes["OverwrittenClass"]).toBe(OverwrittenClass);
  })
});
describe("Hydratable", function(){
  it('should restore children in HydratableClass (HydratableArgs.providers) work)', function(){
    class Plant{
      constructor(public weight:number){}
    }
    class Fruit extends Plant{
      constructor(weight:number, public sweetiness:number){
        super(weight);
      }
    }
    class Apple extends Fruit{
      constructor(weight:number, sweetiness:number, public color:string, public parent:Fruit){
        super(weight, sweetiness);
      }
    }
    Hydrator.provideClasses([Plant, Fruit, Apple]);

    let redFruit = new Fruit(30, 30);
    let apple = new Apple(25, 28, 'red', redFruit);
    let dehydratedApple = dehydrate(apple);
    let hydratedApple = hydrate(dehydratedApple, Apple);
    expect(hydratedApple).toEqual(jasmine.any(Apple));
    expect(hydratedApple.parent).toEqual(jasmine.any(Fruit));
  });
});
describe("hydrate exception handlers",function(){
  it("should throw error when there was not provided class to hydrate", function(){
    class Plant{
      constructor(public weight:number){}
    }
    class Fruit extends Plant{
      constructor(weight:number, public sweetiness:number){
        super(weight);
      }
    }
    class Apple extends Fruit{
      constructor(weight:number, sweetiness:number, public color:string, public parent:Fruit){
        super(weight, sweetiness);
      }
    }
    Hydrator.resetClasses([Apple]);

    let redFruit = new Fruit(30, 30);
    let apple = new Apple(25, 28, 'red', redFruit);
    let dehydratedApple = dehydrate(apple);
    expect(()=>{hydrate(dehydratedApple, Apple)}).toThrowError("Fruit was not provided to Hydrator")
  })
});
describe("OnHydrate", function(){
  class Parent{
    @OnHydrate(()=>"Parent.OnHydrate applied")
    name:string;
    constructor(name){ this.name = name }
  }
  class Child extends Parent{
    @OnHydrate(()=>"Child.OnHydrate applied")
    age:number;
    constructor(name, age){ super(name); this.age = age;}
  }
  Hydrator.resetClasses([Parent, Child]);
  describe("with original instance", function(){
    let child = new Child('child', 12);
    let hydratedChild = hydrate(child, Child);
    it("should work on own property", function(){
      expect(hydratedChild.age).toBe("Child.OnHydrate applied");
    });
    it("should work on inherited property", function(){
      expect(hydratedChild.name).toBe("Parent.OnHydrate applied");
    });
  });
  describe("with dehydrated objects", function(){
    let child = new Child('child', 12);
    let dehydratedChild = dehydrate(child);
    let hydratedChild = hydrate(dehydratedChild, Child);
    it("should work on own property", function(){
      expect(hydratedChild.age).toBe("Child.OnHydrate applied");
    });
    it("should work on inherited property", function(){
      expect(hydratedChild.name).toBe("Parent.OnHydrate applied");
    });
  });
});
describe("OnDehydrate", function(){
  class Parent{
    @OnDehydrate(()=>"Parent.OnDehydrate applied")
    name:string;
    constructor(name){ this.name = name }
  }
  class Child extends Parent{
    @OnDehydrate(()=>"Child.OnDehydrate applied")
    age:number;
    constructor(name, age){ super(name); this.age = age;}
  }
  Hydrator.resetClasses([Parent, Child]);
  describe("with original instance", function(){
    let child = new Child('child', 12);
    let dehydratedChild = dehydrate(child);
    it("should work on own property", function(){
      expect(dehydratedChild.age).toBe("Child.OnDehydrate applied");
    });
    it("should work on inherited property", function(){
      expect(dehydratedChild.name).toBe("Parent.OnDehydrate applied");
    });
  });
});
describe("both OnDehydrate and OnHydrate", function(){
  class Parent{
    @OnDehydrate(()=>"Parent.OnDehydrate applied")
    @OnHydrate(()=>"Parent.OnHydrate applied")
    name:string;
    constructor(name){ this.name = name }
  }
  class Child extends Parent{
    @OnDehydrate(()=>"Child.OnDehydrate applied")
    @OnHydrate(()=>"Child.OnHydrate applied")
    age:number;
    constructor(name, age){ super(name); this.age = age;}
  }
  Hydrator.resetClasses([Parent, Child]);
  describe("with original instance", function(){
    let child = new Child('child', 12);
    let dehydratedChild = dehydrate(child);
    let hydratedChild = hydrate(dehydratedChild, Child);
    let serializedChild = serialize(child);
    let deserializedChild = deserialize(serializedChild, Child);
    it("should work on own property", function(){
      expect(dehydratedChild.age).toBe("Child.OnDehydrate applied");
      expect(hydratedChild.age).toBe("Child.OnHydrate applied");
      expect(deserializedChild.age).toBe("Child.OnHydrate applied");
    });
    it("should work on inherited property", function(){
      expect(dehydratedChild.name).toBe("Parent.OnDehydrate applied");
      expect(hydratedChild.name).toBe("Parent.OnHydrate applied");
    });
  });
});
describe("Exclude", function(){
  class Parent{
    @Exclude()
    name:string;
    constructor(name){ this.name = name }
  }
  class Child extends Parent{
    @Exclude()
    age:number;
    constructor(name, age){ super(name); this.age = age;}
  }
  Hydrator.resetClasses([Parent, Child]);
  describe("with original instance", function(){
    let child = new Child('child', 12);
    let dehydratedChild = dehydrate(child);
    it("should work on own property", function(){
      expect(dehydratedChild.age).toBeUndefined();
    });
    it("should work on inherited property", function(){
      expect(dehydratedChild.name).toBeUndefined();
    });
  });
});
describe("both Exclude and OnHydrate", function(){
  class Parent{
    @Exclude()
    @OnHydrate(()=>"Parent.OnHydrate applied")
    name:string;
    constructor(name){ this.name = name }
  }
  class Child extends Parent{
    @Exclude()
    @OnHydrate(()=>"Child.OnHydrate applied")
    age:number;
    constructor(name, age){ super(name); this.age = age;}
  }
  Hydrator.resetClasses([Parent, Child]);
  describe("with original instance", function(){
    let child = new Child('child', 12);
    let dehydratedChild = dehydrate(child);
    let hydratedChild = hydrate(dehydratedChild, Child);
    let serializedChild = serialize(child);
    let deserializedChild = deserialize(serializedChild, Child);
    it("should work on own property", function(){
      expect(hydratedChild.age).toBe("Child.OnHydrate applied");
      expect(deserializedChild.age).toBe("Child.OnHydrate applied");
    });
    it("should work on inherited property", function(){
      expect(hydratedChild.name).toBe("Parent.OnHydrate applied");
      expect(deserializedChild.name).toBe("Parent.OnHydrate applied");
    });
  });
});
