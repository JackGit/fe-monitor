let ajaxInjector = new AjaxInjector()

ajaxInjector.install()

ajaxInjector.on('send')
ajaxInjector.on('success')
ajaxInjector.on('error')
ajaxInjector.on('complete')
